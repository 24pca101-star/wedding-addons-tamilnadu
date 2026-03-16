import fs from 'fs';
import { readPsd } from 'ag-psd';
import path from 'path';

const filePath = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/storage/templates/design-1.psd';
const buffer = fs.readFileSync(filePath);
const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });

function printLayers(item, depth = 0, parentX = 0, parentY = 0) {
    const indent = '  '.repeat(depth);
    const absoluteX = item.left || 0;
    const absoluteY = item.top || 0;
    
    console.log(`${indent}${item.name || 'Root'} (Left: ${item.left}, Top: ${item.top}, Width: ${item.width}, Height: ${item.height})`);
    
    if (item.children) {
        for (const child of item.children) {
            printLayers(child, depth + 1, absoluteX, absoluteY);
        }
    }
}

printLayers(psd);
