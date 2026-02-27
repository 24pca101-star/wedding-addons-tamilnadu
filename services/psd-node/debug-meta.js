import { parsePsdMetadata } from './parser.js';
import path from 'path';

const filePath = path.resolve('../../public/storage/templates/design-2.psd');
console.log(`Parsing ${filePath}...`);

parsePsdMetadata(filePath).then(metadata => {
    console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`Elements: ${metadata.elements.length}`);
    metadata.elements.forEach((el, i) => {
        if (el.type === 'text') {
            console.log(`Text Element ${i}: "${el.content}" at (${el.x}, ${el.y}), size: ${el.fontSize}, width: ${el.width}`);
        }
    });
}).catch(err => {
    console.error(err);
});
