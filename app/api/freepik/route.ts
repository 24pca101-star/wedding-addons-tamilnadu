import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // We can read NEXT_PUBLIC variables on the server too, but it's more secure to use private env vars in the future.
        const apiKey = process.env.NEXT_PUBLIC_FREEPIK_API_KEY || process.env.FREEPIK_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Freepik API key not configured on the server." }, 
                { status: 500 }
            );
        }

        const response = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-freepik-api-key": apiKey
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Freepik API responded with error:", response.status, errText);
            return NextResponse.json(
                { error: `Freepik API Error: ${response.status}`, details: errText }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error: any) {
        console.error("Next.js API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to contact Freepik API proxy." }, 
            { status: 500 }
        );
    }
}
