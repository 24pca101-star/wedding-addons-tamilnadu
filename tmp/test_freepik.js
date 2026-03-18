import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_FREEPIK_API_KEY || process.env.FREEPIK_API_KEY;

async function testRemoveBg() {
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
