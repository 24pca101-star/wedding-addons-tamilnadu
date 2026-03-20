import fs from 'fs';
import path from 'path';
import axios from 'axios';

const CATEGORY = 'ceremony-decor';
const SUBCATEGORY = 'welcome-banner';
const TEMPLATES_DIR = 'C:/Users/gurud/nextjs_task/IN/wedding-addons-tamilnadu/public/storage/templates/ceremony-decor/welcome-banner';
const API_BASE_URL = 'http://localhost:5005/api/psd/layers';

async function reprocess() {
    console.log(`🚀 Starting re-processing for ${CATEGORY}/${SUBCATEGORY}...`);
    
    if (!fs.existsSync(TEMPLATES_DIR)) {
        console.error(`❌ Directory not found: ${TEMPLATES_DIR}`);
        return;
    }

    const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.psd') && !f.endsWith('_rgb.psd'));
    console.log(`📂 Found ${files.length} PSD files.`);

    for (const file of files) {
        const url = `${API_BASE_URL}/${CATEGORY}/${SUBCATEGORY}/${file}`;
        console.log(`🔄 Processing ${file}...`);
        try {
            const startTime = Date.now();
            const response = await axios.get(url);
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ Success: ${file} (${duration}s) - Layers: ${response.data.layers?.length || 0}`);
        } catch (error) {
            console.error(`❌ Failed: ${file} - ${error.message}`);
            if (error.response) {
                console.error(`   Status: ${error.response.status}`);
            }
        }
    }
    
    console.log('✨ Re-processing complete!');
}

reprocess();
