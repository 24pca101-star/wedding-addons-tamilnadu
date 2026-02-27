import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

initializeCanvas(createCanvas);

const filePath = path.resolve('../../public/storage/templates/design-6.psd');
console.log(`Analyzing ${filePath}...`);

const buffer = fs.readFileSync(filePath);
const psd = readPsd(buffer);

console.log(`PSD Dimensions: ${psd.width}x${psd.height}`);

function checkLayers(item, depth = 0) {
    const indent = '  '.repeat(depth);
    const name = item.name || 'Unnamed';
    const dims = `${item.width || '?'}x${item.height || '?'} at [${item.left || 0},${item.top || 0}]`;
    const hasCanvas = !!item.canvas;
    const isText = !!item.text;
    const isVisible = item.visible !== false;

    if (item.children) {
        console.log(`${indent}📁 Group: ${name} - Visible: ${isVisible}`);
        item.children.forEach(child => checkLayers(child, depth + 1));
    } else {
        console.log(`${indent}📄 Layer: ${name} - ${dims} - Visible: ${isVisible}, HasCanvas: ${hasCanvas}, IsText: ${isText}`);
    }
}

checkLayers(psd);
