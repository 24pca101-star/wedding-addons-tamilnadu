async function testBinaryUpload() {
    const apiKey = "FPSX96aea39515f4c4ea8ef8784d1c1338fd";
    const prompt = "watercolor floral corner arrangement with pink roses, isolated on white background, high quality";
    
    console.log("1. Generating Image (Fast)...");
    const genResponse = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-freepik-api-key": apiKey
        },
        body: JSON.stringify({ prompt, num_images: 1 })
    });

    const genData = await genResponse.json();
    if (!genResponse.ok) {
        console.error("Generation Failed:", genData);
        return;
    }

    const base64 = genData.data[0].base64;
    console.log("Success: Image generated (Base64 received)");

    console.log("2. Uploading Binary for Background Removal...");
    const buffer = Buffer.from(base64, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });

    const form = new FormData();
    form.append('image_file', blob, 'image.png');

    const removeBgResponse = await fetch("https://api.freepik.com/v1/ai/beta/remove-background", {
        method: "POST",
        headers: {
            "x-freepik-api-key": apiKey
        },
        body: form
    });

    const bgData = await removeBgResponse.json();
    console.log("BG Removal Status:", removeBgResponse.status);
    console.log("BG Removal Response:", JSON.stringify(bgData, null, 2));
}

testBinaryUpload();
