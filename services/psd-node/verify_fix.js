import path from 'path';
import { parsePsdMetadata } from './parser.js';
import fs from 'fs';

async function verify() {
    const filename = 'design-1.psd';
    const templatesDir = path.resolve(process.cwd(), '../../public/storage/templates');
    const filePath = path.join(templatesDir, filename);
    const publicDir = path.resolve(process.cwd(), '../../public');

    console.log(`Verifying metadata for: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    try {
        const metadata = await parsePsdMetadata(filePath, publicDir);
        console.log(`✅ Metadata extracted!`);
        console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
        console.log(`Layer count: ${metadata.layers.length}`);
        
        // Check for specific layers if possible
        metadata.layers.forEach((l, i) => {
            console.log(`Layer ${i}: ${l.name} (Type: ${l.type}, Visible: ${l.visible}, Opacity: ${l.opacity})`);
        });

        const hasFlattened = metadata.layers.some(l => l.isFlattened);
        console.log(`Any flattened groups? ${hasFlattened}`);
        
        if (hasFlattened) {
            console.error('❌ FAILURE: Some groups are still being flattened!');
        } else {
            console.log('✅ SUCCESS: No groups were flattened.');
        }

    } catch (e) {
        console.error('❌ Verification FAILED:', e.message);
    }
}

verify();
