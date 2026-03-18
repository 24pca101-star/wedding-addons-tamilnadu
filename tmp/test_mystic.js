async function testMystic() {
    const apiKey = "FPSX96aea39515f4c4ea8ef8784d1c1338fd";
    const prompt = "watercolor floral corner arrangement with pink roses, isolated on white background, high quality";
    
    console.log("Testing Freepik Mystic API...");
    const response = await fetch("https://api.freepik.com/v1/ai/mystic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-freepik-api-key": apiKey
        },
        body: JSON.stringify({ prompt, num_images: 1 })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
}

testMystic();
