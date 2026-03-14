import { generatePreview } from './parser.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../../public/storage/templates');
const PREVIEWS_DIR = path.resolve(__dirname, '../../public/storage/previews');

async function generateAll() {
    const files = fs.readdirSync(TEMPLATES_DIR);
    const psds = files.filter(f => f.endsWith('.psd') && !f.endsWith('_rgb.psd'));
    
    for (const psd of psds) {
        const inputPath = path.join(TEMPLATES_DIR, psd);
        const outputPath = path.join(PREVIEWS_DIR, psd.replace('.psd', '.png'));
        
        if (!fs.existsSync(outputPath)) {
            console.log(`⏳ Generating preview for ${psd}...`);
            try {
                await generatePreview(inputPath, outputPath);
                console.log(`✅ Success for ${psd}`);
            } catch (err) {
                console.error(`❌ Failed for ${psd}:`, err.message);
            }
        } else {
            console.log(`⏭️ Preview already exists for ${psd}, skipping.`);
        }
    }
    console.log("🎉 All previews generated successfully!");
}

generateAll();
