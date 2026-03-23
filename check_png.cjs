const sharp = require('sharp');
const path = 'd:/INTERNSHIP_PROJECT/wedding-addons-tamilnadu/public/storage/layers/sign-board1 .psd/0.png';

sharp(path).metadata().then(meta => {
    console.log('PNG Dimensions:', meta.width, 'x', meta.height);
}).catch(err => console.error(err));
