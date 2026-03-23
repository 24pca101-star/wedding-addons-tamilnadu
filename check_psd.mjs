import fs from 'fs';
import { readPsd } from 'ag-psd';

const filePath = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/storage/templates/ceremony-decor/directional-sign-boards/sign-board1 .psd';

try {
    const buffer = fs.readFileSync(filePath);
    const psd = readPsd(buffer, { skipLayerImageData: true, skipThumbnail: true });
    console.log('PSD Dimensions:', psd.width, 'x', psd.height);
} catch (e) {
    console.error('Error:', e.message);
}
