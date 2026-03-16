import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize ag-psd with node-canvas
initializeCanvas(createCanvas);

const PUBLIC_MOCKUPS_DIR = path.resolve(__dirname, '../../public/assets/mockups');

async function generatePreview(inputPath, outputPath) {
    try {
        const buffer = fs.readFileSync(inputPath);
        const psd = readPsd(buffer);
        
        const mainCanvas = createCanvas(psd.width, psd.height);
        const ctx = mainCanvas.getContext('2d');
        
        // Use transparent background for mockups if possible, or white
        ctx.fillStyle = 'rgba(255, 255, 255, 0)'; 
        ctx.fillRect(0, 0, psd.width, psd.height);

        if (psd.canvas) {
            ctx.drawImage(psd.canvas, 0, 0);
        } else {
            function drawAll(item) {
                if (item.children) {
                    for (const child of item.children) drawAll(child);
                } else if (item.canvas && item.visible !== false) {
                    ctx.globalAlpha = item.opacity ?? 1;
                    ctx.drawImage(item.canvas, item.left || 0, item.top || 0);
                }
            }
            drawAll(psd);
        }

        const pngBuffer = mainCanvas.toBuffer('image/png');
        await sharp(pngBuffer).toFile(outputPath);
        return true;
    } catch (error) {
        console.error(`❌ Failed to generate preview for ${path.basename(inputPath)}:`, error.message);
        return false;
    }
}

async function processDirectory(dirName) {
    const dirPath = path.join(PUBLIC_MOCKUPS_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
        console.warn(`⚠️ Directory not found: ${dirPath}`);
        return;
    }

    console.log(`📂 Processing mockups in: ${dirName}...`);
    const files = fs.readdirSync(dirPath);
    const psdFiles = files.filter(f => f.endsWith('.psd'));

    for (const file of psdFiles) {
        const baseName = path.basename(file, '.psd');
        const inputPath = path.join(dirPath, file);
        const outputPath = path.join(dirPath, `${baseName}.png`);

        if (fs.existsSync(outputPath)) {
            console.log(`⏩ Skipping ${file} (PNG already exists)`);
            continue;
        }

        console.log(`🎨 Generating PNG for ${file}...`);
        const success = await generatePreview(inputPath, outputPath);
        if (success) {
            console.log(`✅ Generated ${baseName}.png`);
        }
    }
}

async function run() {
    console.log('🚀 Starting Mockup PNG Generation...');
    
    const categories = ['tote-bags', 'hand-fans', 'directional-boards'];
    
    for (const cat of categories) {
        await processDirectory(cat);
    }
    
    console.log('✨ All done!');
}

run();
