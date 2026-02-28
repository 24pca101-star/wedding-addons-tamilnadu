import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
initializeCanvas(createCanvas);

async function analyzeLayers() {
    const templatesDir = path.resolve(__dirname, '../../public/storage/templates');
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.psd'));

    for (const file of files) {
        console.log(`\n--- Analyzer: ${file} ---`);
        try {
            const buffer = fs.readFileSync(path.join(templatesDir, file));
            const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });

            function logGroups(item, indent = '') {
                if (item.children) {
                    console.log(`${indent}📁 Folder: "${item.name}" (Children: ${item.children.length})`);
                    for (const child of item.children) {
                        logGroups(child, indent + '  ');
                    }
                } else {
                    const type = item.text ? 'Text' : 'Image';
                    // console.log(`${indent}📄 ${type}: "${item.name}"`);
                }
            }
            logGroups(psd);
        } catch (e) {
            console.error(`Failed to analyze ${file}:`, e.message);
        }
    }
}

analyzeLayers();
