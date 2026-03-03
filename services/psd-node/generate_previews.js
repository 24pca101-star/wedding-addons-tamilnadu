import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generatePreview } from './parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../../public/storage/templates');
const PREVIEWS_DIR = path.resolve(__dirname, '../../public/storage/previews');

async function run() {
    console.log('🔍 Checking for missing PSD previews...');

    if (!fs.existsSync(PREVIEWS_DIR)) {
        fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
    }

    try {
        const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.psd') && !f.endsWith('_rgb.psd'));

        for (const file of files) {
            const psdPath = path.join(TEMPLATES_DIR, file);
            const pngName = file.replace('.psd', '.png');
            const pngPath = path.join(PREVIEWS_DIR, pngName);

            let needsGeneration = false;
            if (!fs.existsSync(pngPath)) {
                needsGeneration = true;
                console.log(`🆕 Missing preview for ${file}`);
            } else {
                const psdStats = fs.statSync(psdPath);
                const pngStats = fs.statSync(pngPath);
                if (psdStats.mtime > pngStats.mtime) {
                    needsGeneration = true;
                    console.log(`🔄 Outdated preview for ${file}`);
                }
            }

            if (needsGeneration) {
                console.log(`🎨 Generating preview for ${file}...`);
                try {
                    await generatePreview(psdPath, pngPath);
                    console.log(`✅ Success: ${pngName}`);
                } catch (err) {
                    console.error(`❌ Failed to generate preview for ${file}:`, err.message);
                }
            } else {
                console.log(`⏭️ Preview already exists for ${file}`);
            }
        }

        console.log('\n✨ Batch preview generation complete.');
    } catch (err) {
        console.error('💥 Fatal error during preview generation:', err.message);
    }
}

run();
