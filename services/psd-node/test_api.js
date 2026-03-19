import axios from 'axios';
import fs from 'fs';

async function test() {
    console.log('Testing PSD Node Service...');
    try {
        const h = await axios.get('http://localhost:5005/health');
        console.log('Health:', h.data);

        const filename = 'tote-bag-design-2.psd';
        console.log(`Testing metadata for: ${filename}`);
        const m = await axios.get(`http://localhost:5005/api/psd/layers/${filename}`);
        console.log('Metadata received! Layer count:', m.data.layers.length);

        console.log(`Testing preview for: ${filename}`);
        const p = await axios.get(`http://localhost:5005/preview/${filename.replace('.psd', '.png')}`, { responseType: 'arraybuffer' });
        console.log('Preview received! Size:', p.data.length);
    } catch (e) {
        console.error('Test FAILED:', e.message);
        if (e.response) {
            console.error('Response Status:', e.response.status);
            console.error('Response Data:', e.response.data);
        }
    }
}

test();
