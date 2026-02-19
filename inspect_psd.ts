import { readPsd } from 'ag-psd';
import fs from 'fs';
import path from 'path';

const psdDir = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/templates/minicalender';
const files = fs.readdirSync(psdDir).filter(f => f.endsWith('.psd'));

files.forEach(file => {
    console.log(`\n--- Inspecting: ${file} ---`);
    const buffer = fs.readFileSync(path.join(psdDir, file));
    try {
        const psd = readPsd(buffer);
        console.log(`Main PSD: ${psd.width}x${psd.height}`);
        if (psd.children) {
            psd.children.forEach((layer, i) => {
                const type = layer.text ? 'TEXT' : (layer.canvas ? 'IMAGE' : 'UNKNOWN/GROUP');
                console.log(`Layer ${i}: name="${layer.name}", type=${type}, left=${layer.left}, top=${layer.top}`);
                if (layer.text) {
                    console.log(`  Text Content: "${layer.text.text.substring(0, 50)}..."`);
                }
                if (layer.children) {
                    console.log(`  Has ${layer.children.length} sub-children`);
                    layer.children.forEach((child, j) => {
                        const ctype = child.text ? 'TEXT' : (child.canvas ? 'IMAGE' : 'UNKNOWN/GROUP');
                        console.log(`    Sub-Layer ${j}: name="${child.name}", type=${ctype}`);
                    });
                }
            });
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
    }
});
