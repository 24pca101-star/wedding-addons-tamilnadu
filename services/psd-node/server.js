const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { readPsd } = require('ag-psd');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

process.on('uncaughtException', (err) => {
    console.error('FATAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(cors());
app.use(express.json());

const { parsePsdMetadata, generatePreview } = require('./parser');

const TEMPLATE_DIR = path.resolve(process.cwd(), '../../public/storage/templates');
const PREVIEW_DIR = path.resolve(process.cwd(), '../../public/storage/previews');

// Ensure directories exist
[TEMPLATE_DIR, PREVIEW_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.get('/parse/:filename', async (req, res) => {
    try {
        const filePath = path.join(TEMPLATE_DIR, req.params.filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

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
        // Always derive PSD name for input and PNG name for output
        const psdFilename = filename.endsWith('.psd') ? filename : filename.replace('.png', '.psd');
        const pngFilename = psdFilename.replace('.psd', '.png');

        const inputPath = path.join(TEMPLATE_DIR, psdFilename);
        const outputPath = path.join(PREVIEW_DIR, pngFilename);

        if (!fs.existsSync(inputPath)) return res.status(404).json({ error: 'PSD File not found' });

        // Only generate if it doesn't exist to save resources
        if (!fs.existsSync(outputPath)) {
            try {
                await generatePreview(inputPath, outputPath);
                res.sendFile(outputPath);
            } catch (genError) {
                console.warn(`Falling back to placeholder for ${filename}:`, genError.message);
                const fallbackPath = path.resolve(process.cwd(), '../../public/assets/blank-canvas.png');
                if (fs.existsSync(fallbackPath)) {
                    res.sendFile(fallbackPath);
                } else {
                    res.status(500).json({ error: 'Preview generation and fallback failed' });
                }
            }
        } else {
            res.sendFile(outputPath);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Preview route error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'psd-service-node' });
});

app.listen(PORT, () => {
    console.log(`Node.js PSD Service running on http://localhost:${PORT}`);
});
