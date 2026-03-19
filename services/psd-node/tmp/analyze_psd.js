
import fs from 'fs';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';

initializeCanvas(createCanvas);

const filePath = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/storage/templates/design-4.psd';
const buffer = fs.readFileSync(filePath);
const psd = readPsd(buffer, { skipLayerImageData: true });

console.log('--- PSD ROOT ---');
console.log(`Dimensions: ${psd.width}x${psd.height}`);
console.log(`Layers count: ${psd.children ? psd.children.length : 0}`);

function inspect(item, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}Layer: "${item.name}" (Visible: ${item.visible !== false})`);
    console.log(`${indent}  Bounds: L:${item.left}, T:${item.top}, R:${item.right}, B:${item.bottom}`);
    console.log(`${indent}  Size: W:${item.width}, H:${item.height}`);
    
    if (item.children) {
        console.log(`${indent}  (Group with ${item.children.length} children)`);
        for (const child of item.children) {
            inspect(child, depth + 1);
        }
    }
}

if (psd.children) {
    psd.children.forEach((child, i) => {
        console.log(`[${i}] Top-level child`);
        inspect(child, 1);
    });
}
