async function checkLayers() {
    const filename = process.argv[2] || 'traditional-utility-items/printed-visiri-hand-fan/handfan1.psd';
    const url = `http://localhost:5005/api/psd/layers/${filename}`;
    
    console.log(`Checking layers for ${filename}...`);
    try {
        const response = await fetch(url);
        const metadata = await response.json();
        
        console.log(`Total layers: ${metadata.layers.length}`);
        metadata.layers.forEach((l, i) => {
            console.log(`[${i}] ${l.name} (${l.type}) - visible: ${l.visible}, opacity: ${l.opacity}, clipping: ${l.clipping}`);
        });
    } catch (e) {
        console.error(e);
    }
}

checkLayers();
