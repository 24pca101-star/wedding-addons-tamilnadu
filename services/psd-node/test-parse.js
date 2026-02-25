const fs = require('fs');
const { readPsd, initializeCanvas } = require('ag-psd');
const Canvas = require('canvas');

// Initialize ag-psd with node-canvas implementation
initializeCanvas(Canvas.createCanvas);

const filePath = process.argv[2];
if (!filePath) {
    console.error("Please provide a PSD file path");
    process.exit(1);
}

console.log(`Reading ${filePath}...`);
try {
    const buffer = fs.readFileSync(filePath);
    console.log(`File read into buffer (${buffer.length} bytes).`);

    console.log("Trial 1: readPsd with skipLayerData: true, skipThumbnail: false...");
    try {
        const psd1 = readPsd(buffer, { skipLayerData: true, skipThumbnail: false });
        console.log("Trial 1 SUCCESS!");
        console.log(`- Dimensions: ${psd1.width}x${psd1.height}`);
        console.log(`- Has Canvas: ${!!psd1.canvas}`);
        if (psd1.canvas) {
            console.log("Attempting to get PNG buffer from canvas...");
            const buf = psd1.canvas.toBuffer('image/png');
            console.log(`Successfully generated buffer: ${buf.length} bytes`);
        }
    } catch (e1) {
        console.error("Trial 1 FAILED:");
        console.error(e1);
    }

    console.log("Trial 2: readPsd with skipLayerData: false, skipThumbnail: true...");
    try {
        const psd2 = readPsd(buffer, { skipLayerData: false, skipThumbnail: true });
        console.log("Trial 2 SUCCESS!");
        console.log(`- Dimensions: ${psd2.width}x${psd2.height}`);
        console.log(`- Layers: ${psd2.children ? psd2.children.length : 0}`);
    } catch (e2) {
        console.error("Trial 2 FAILED:");
        console.error(e2);
    }
} catch (error) {
    console.error("Global Error:", error);
}
