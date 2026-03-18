import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, autoRemove } = body; // Extract prompt and autoRemove from body
        const apiKey = process.env.NEXT_PUBLIC_FREEPIK_API_KEY || process.env.FREEPIK_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API key missing" }, { status: 500 });
        }

        // 1. Generate Image (Synchronous & Fast)
        console.log("Freepik: Generating fast image for prompt:", prompt);
        
        const genResponse = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-freepik-api-key": apiKey,
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                prompt: prompt,
                num_images: 1,
                guidance_scale: 7
            })
        });

        const genData = await genResponse.json();
        
        // Log to file for user visibility
        try {
            const fs = require('fs');
            const path = require('path');
            const logMsg = `[${new Date().toISOString()}] GEN_RES: ${JSON.stringify(genData).substring(0, 200)}...\n`;
            fs.appendFileSync(path.join(process.cwd(), 'freepik_debug.log'), logMsg);
        } catch (e) {}

        if (!genResponse.ok) {
            console.error("Freepik: Generation Failed:", genData);
            return NextResponse.json({ 
                error: "Failed to generate image",
                details: genData.message || JSON.stringify(genData)
            }, { status: genResponse.status });
        }

        let imageUrl = "";
        let isTransparent = false;

        if (genData.data && genData.data[0]) {
            imageUrl = genData.data[0].url || genData.data[0].base64;
            // Handle raw base64
            if (genData.data[0].base64 && !imageUrl.startsWith('data:')) {
                imageUrl = `data:image/png;base64,${genData.data[0].base64}`;
            }
        }

        if (!imageUrl) {
            return NextResponse.json({ error: "No image generated" }, { status: 500 });
        }

        // 2. Perfect Background Removal via Binary Upload
        if (autoRemove) {
            console.log("Freepik: Requesting perfect background removal (Binary Upload)...");
            try {
                // Convert Base64 (from generation) to Blob for upload
                const base64Part = imageUrl.includes(',') ? imageUrl.split(',')[1] : imageUrl;
                const buffer = Buffer.from(base64Part, 'base64');
                const blob = new Blob([buffer], { type: 'image/png' });

                const form = new FormData();
                form.append('image_file', blob, 'image.png');

                const bgResp = await fetch('https://api.freepik.com/v1/ai/beta/remove-background', {
                    method: 'POST',
                    headers: { 'x-freepik-api-key': apiKey },
                    body: form
                });
                
                const bgData = await bgResp.json();
                
                // Log BG removal attempt
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const logMsg = `[${new Date().toISOString()}] BG_REMOVE_RES (${bgResp.status}): ${JSON.stringify(bgData)}\n`;
                    fs.appendFileSync(path.join(process.cwd(), 'freepik_debug.log'), logMsg);
                } catch (e) {}

                if (bgResp.ok) {
                    const transparentImageUrl = bgData.url || bgData.high_resolution || (bgData.data && bgData.data.image_url);
                    
                    if (transparentImageUrl) {
                        console.log("Freepik: BG removal success, fetching result...");
                        const imgRes = await fetch(transparentImageUrl);
                        if (imgRes.ok) {
                            const imgBuffer = await imgRes.arrayBuffer();
                            const imgBase64 = Buffer.from(imgBuffer).toString('base64');
                            imageUrl = `data:image/png;base64,${imgBase64}`;
                            isTransparent = true;
                        }
                    }
                }
            } catch (e: any) {
                console.error('Freepik: BG Removal Exception:', e.message);
                try {
                    const fs = require('fs');
                    const path = require('path');
                    fs.appendFileSync(path.join(process.cwd(), 'freepik_debug.log'), `[${new Date().toISOString()}] BG_ERROR: ${e.message}\n`);
                } catch (err) {}
            }
        }

        return NextResponse.json({ 
            url: imageUrl, 
            isTransparent: isTransparent,
            success: true
        });
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
