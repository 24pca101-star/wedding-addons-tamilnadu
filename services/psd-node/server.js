import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import opentype from 'opentype.js';
import axios from 'axios';
import sharp from 'sharp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize ag-psd with node-canvas
initializeCanvas(createCanvas);

const app = express();
const PORT = process.env.PORT || 5001;

// Directories
const TEMPLATES_DIR = path.resolve(__dirname, '../../public/storage/templates');
const PREVIEWS_DIR = path.resolve(__dirname, '../../public/storage/previews');
console.log('Previews directory:', PREVIEWS_DIR);
const FONTS_DIR = path.resolve(__dirname, './fonts');

// Ensure directories exist
[TEMPLATES_DIR, PREVIEWS_DIR, FONTS_DIR].forEach(dir => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// Font mapping
const FONT_OBJECTS = {};
async function loadFonts() {
    try {
        const files = await fs.readdir(FONTS_DIR);
        for (const file of files) {
            if (file.endsWith('.ttf') || file.endsWith('.otf')) {
                const buffer = await fs.readFile(path.join(FONTS_DIR, file));
                const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
                const name = path.basename(file, path.extname(file));
                FONT_OBJECTS[name] = font;
                console.log(`🔤 Loaded font: ${name}`);
            }
        }
    } catch (err) {
        console.warn('⚠️ No fonts found in Fonts directory');
    }
}
await loadFonts();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

import { parsePsdMetadata, generateCleanPreview } from './parser.js';
import { getFontMap, generateFontFaceCSS } from './fontLoader.js';

// Logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve fonts directory statically
app.use('/fonts', express.static(FONTS_DIR));

// Serve storage directory (previews, layers)
const STORAGE_DIR = path.resolve(__dirname, '../../public/storage');
app.use('/storage', express.static(STORAGE_DIR));

// Keep /previews for backward compatibility if needed, or remove if everything uses /storage
app.use('/previews', express.static(PREVIEWS_DIR));

app.get('/api/psd/fonts', (req, res) => {
    try {
        const fontMap = getFontMap(FONTS_DIR);
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        const css = generateFontFaceCSS(fontMap, baseUrl);
        res.json({
            fonts: fontMap,
            css: css
        });
    } catch (error) {
        console.error("Font fetch failed:", error);
        res.status(500).json({ error: 'Failed to load fonts' });
    }
});

app.get('/api/psd/layers/:filename', async (req, res) => {
    try {
        const filename = req.params.filename.endsWith('.psd') ? req.params.filename : `${req.params.filename}.psd`;
        const filePath = path.join(TEMPLATES_DIR, filename);
        if (!existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

        const PUBLIC_DIR = path.resolve(process.cwd(), '../../public');
        const metadata = await parsePsdMetadata(filePath, PUBLIC_DIR);
        res.json(metadata);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Parsing failed' });
    }
});

app.get('/parse/:filename', async (req, res) => {
    try {
        const filename = req.params.filename.endsWith('.psd') ? req.params.filename : `${req.params.filename}.psd`;
        const filePath = path.join(TEMPLATES_DIR, filename);
        if (!existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

        const PUBLIC_DIR = path.resolve(process.cwd(), '../../public');
        const metadata = await parsePsdMetadata(filePath, PUBLIC_DIR);
        res.json(metadata);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Parsing failed' });
    }
});

app.get('/preview/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const psdFilename = filename.endsWith('.psd') ? filename : filename.replace('.png', '.psd');
        const pngFilename = psdFilename.replace('.psd', '.png');

        const inputPath = path.join(TEMPLATES_DIR, psdFilename);
        const outputPath = path.join(PREVIEWS_DIR, pngFilename);

        if (!existsSync(inputPath)) return res.status(404).json({ error: 'PSD File not found' });

        let needsGeneration = true;
        try {
            const psdStats = await fs.stat(inputPath);
            const pngStats = await fs.stat(outputPath);
            if (pngStats.mtime >= psdStats.mtime) {
                needsGeneration = false;
                console.log(`🚀 Serving CACHED preview for ${psdFilename}`);
            }
        } catch (e) {
            // PNG doesn't exist
        }

        if (needsGeneration) {
            console.log(`🎨 Generating NEW clean preview for ${psdFilename}`);
            await generateCleanPreview(inputPath, outputPath);
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.sendFile(outputPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Preview generation failed' });
    }
});

const DOTNET_SERVICE_URL = process.env.DOTNET_SERVICE_URL || 'http://localhost:5199';

app.post('/generate-mockup', async (req, res) => {
    try {
        const response = await axios.post(`${DOTNET_SERVICE_URL}/api/Mockup/generate`, req.body, {
            responseType: 'arraybuffer'
        });

        let imageBuffer = Buffer.from(response.data);

        if (req.query.width || req.query.height) {
            imageBuffer = await sharp(imageBuffer)
                .resize(
                    parseInt(req.query.width) || null,
                    parseInt(req.query.height) || null,
                    { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }
                )
                .toBuffer();
        }

        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Mockup generation proxy failed:', error.message);
        res.status(500).json({ error: 'Mockup generation failed', details: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'psd-service-node' });
});

app.listen(PORT, () => {
    console.log(`🚀 PSD Node Service (ESM) running on http://localhost:${PORT}`);
});
