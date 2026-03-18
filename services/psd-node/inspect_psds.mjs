import fs from 'fs';
import path from 'path';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';

initializeCanvas(createCanvas);

const SRC_DIR = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/assets/mockups/directional-boards';

async function inspect(filename) {
    const inputPath = path.join(SRC_DIR, filename);
    console.log(`\n--- Inspecting ${filename} ---`);
    const buffer = fs.readFileSync(inputPath);
    const psd = readPsd(buffer, { skipLayerImageData: true });

    function listLayers(item, depth = 0) {
        const indent = '  '.repeat(depth);
        const name = item.name || 'Unnamed';
        const type = item.text ? 'Text' : (item.children ? 'Group' : 'Image');
        const dims = `${item.width}x${item.height} at (${item.left},${item.top})`;
        console.log(`${indent}${name} [${type}] ${dims} Visible: ${item.visible !== false}`);
        if (item.children) {
            for (const child of item.children) listLayers(child, depth + 1);
        }
    }
    listLayers(psd);
}

inspect('directional-sign-3.psd')
    .then(() => inspect('directional-sign-4.psd'))
    .catch(err => console.error(err));
