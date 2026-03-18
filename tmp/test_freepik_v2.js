async function testRemoveBg() {
    const apiKey = "FPSX96aea39515f4c4ea8ef8784d1c1338fd";
    const imageUrl = "https://img.freepik.com/free-photo/beautiful-pink-roses-isolated-white-background_1232-2345.jpg";
    
    console.log("Testing Freepik Remove Background API...");
    const response = await fetch("https://api.freepik.com/v1/ai/beta/remove-background", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-freepik-api-key": apiKey
        },
        body: JSON.stringify({ image_url: imageUrl })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
}

testRemoveBg();
