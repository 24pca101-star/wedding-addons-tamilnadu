async function testFullSequence() {
    const apiKey = "FPSX96aea39515f4c4ea8ef8784d1c1338fd";
    const prompt = "watercolor floral corner arrangement with pink roses, isolated on white background, high quality";
    
    console.log("1. Generating Image...");
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

    const imageUrl = genData.data[0].url;
    console.log("Generated Image URL:", imageUrl);

    console.log("2. Removing Background...");
    const removeBgResponse = await fetch("https://api.freepik.com/v1/ai/beta/remove-background", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-freepik-api-key": apiKey,
            "Accept": "application/json"
        },
        body: new URLSearchParams({ image_url: imageUrl }).toString()
    });

    const bgData = await removeBgResponse.json();
    console.log("BG Removal Status:", removeBgResponse.status);
    console.log("BG Removal Response:", JSON.stringify(bgData, null, 2));
}

testFullSequence();
