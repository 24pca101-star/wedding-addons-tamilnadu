import fs from 'fs';
import { readPsd, initializeCanvas } from 'ag-psd';
import { createCanvas } from 'canvas';

initializeCanvas(createCanvas);

const filePath = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/storage/templates/banner.psd';
const buffer = fs.readFileSync(filePath);
const psd = readPsd(buffer, { skipLayerImageData: true });

console.log(`PSD: ${psd.width}x${psd.height}`);
console.log(`Total children: ${psd.children ? psd.children.length : 0}`);

if (psd.children) {
    psd.children.forEach((c, i) => {
        console.log(`Layer ${i}: ${c.name} (L:${c.left}, T:${c.top}, W:${c.width}, H:${c.height})`);
        if (c.children) {
            c.children.forEach((cc, ii) => {
                console.log(`  Sublayer ${ii}: ${cc.name} (L:${cc.left}, T:${cc.top}, W:${cc.width}, H:${cc.height})`);
            });
        }
    });
}
