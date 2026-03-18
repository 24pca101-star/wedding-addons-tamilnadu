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
    console.log("Generation Status:", genResponse.status);
    console.log("Generation Response:", JSON.stringify(genData, null, 2));

    let imageUrl = null;
    if (genData.data && genData.data[0]) {
        imageUrl = genData.data[0].url || genData.data[0].base64;
    } else if (genData.url) {
        imageUrl = genData.url;
    }

    if (!imageUrl) {
        console.error("Failed to extract imageUrl from generation response.");
        return;
    }

    console.log("Extracted Image URL:", imageUrl);

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
