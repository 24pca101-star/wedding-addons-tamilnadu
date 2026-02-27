
import fs from 'fs';
import path from 'path';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initializeCanvas(createCanvas);

const templatesDir = path.resolve(__dirname, '../../public/storage/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.psd'));

files.forEach(file => {
    const filePath = path.join(templatesDir, file);
    try {
        const buffer = fs.readFileSync(filePath);
        const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });

        const textFound = [];
        let maxX = psd.width;
        let maxY = psd.height;
        function extractText(item) {
            if (item.children) {
                item.children.forEach(extractText);
            } else {
                const left = Math.round(item.left || 0);
                const top = Math.round(item.top || 0);
                const right = Math.round(item.right || 0);
                const bottom = Math.round(item.bottom || 0);
                const width = Math.round(right - left) || Math.round(item.width || 0);
                const height = Math.round(bottom - top) || Math.round(item.height || 0);

                maxX = Math.max(maxX, left + width);
                maxY = Math.max(maxY, top + height);

                if (item.text) {
                    textFound.push(`${item.text.text} (y:${top}, h:${height})`);
                }
            }
        }
        if (psd.children) psd.children.forEach(extractText);

        if (textFound.some(t => t.includes('JOUSHUA') || t.includes('November'))) {
            console.log(`FOUND in ${file}:`);
            console.log(`Original: ${psd.width}x${psd.height}, Calculated: ${maxX}x${maxY}`);
            console.log(`Text: ${textFound.join(' | ')}`);
        }
    } catch (err) {
        // console.error(`Error reading ${file}:`, err.message);
    }
});
