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
// Serve previews directory statically for layered access
app.use('/previews', express.static(PREVIEWS_DIR));

app.get('/api/psd/fonts', (req, res) => {
    try {
        const fontMap = getFontMap(FONTS_DIR);
        // Assuming the app runs on the same host or we use a relative URL
        // But for absolute clarity, we can build the base URL
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

        const metadata = await parsePsdMetadata(filePath);
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

        // INTELLIGENT CACHING:
        // Check if PNG exists and is newer than PSD
        let needsGeneration = true;
        try {
            const psdStats = await fs.stat(inputPath);
            const pngStats = await fs.stat(outputPath);
            if (pngStats.mtime >= psdStats.mtime) {
                needsGeneration = false;
                console.log(`🚀 Serving CACHED preview for ${psdFilename}`);
            }
        } catch (e) {
            // PNG doesn't exist, will generate
        }

        if (needsGeneration) {
            console.log(`🎨 Generating NEW clean preview for ${psdFilename}`);
            await generateCleanPreview(inputPath, outputPath);
        }

        // Explicitly set CORS to avoid browser issues
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.sendFile(outputPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Preview generation failed' });
    }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'psd-service-node' }));

app.listen(PORT, () => {
    console.log(`🚀 PSD Node Service (ESM) running on http://localhost:${PORT}`);
});
