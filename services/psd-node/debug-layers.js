import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

initializeCanvas(createCanvas);

const filePath = path.resolve('../../public/storage/templates/design-3.psd');
console.log(`Analyzing ${filePath}...`);

const buffer = fs.readFileSync(filePath);
const psd = readPsd(buffer);

function checkLayers(item, depth = 0) {
    const indent = '  '.repeat(depth);
    if (item.children) {
        console.log(`${indent}📁 Group: ${item.name}`);
        item.children.forEach(child => checkLayers(child, depth + 1));
    } else {
        const hasCanvas = !!item.canvas;
        const isText = !!item.text;
        const dims = `${item.width}x${item.height} at [${item.left},${item.top}]`;
        console.log(`${indent}📄 Layer: ${item.name || 'Unnamed'} - ${dims} - HasCanvas: ${hasCanvas}, IsText: ${isText}`);
    }
}

checkLayers(psd);
