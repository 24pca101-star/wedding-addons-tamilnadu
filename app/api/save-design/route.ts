import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * Extract only editable design data (text, positions, colors)
 * Images stay in /public/templates/ - NOT saved to DB
 */
function extractDesignJson(canvasData: any, templateUrl?: string) {
    const cleanJson: any = {
        template: templateUrl || null,
        width: canvasData.width,
        height: canvasData.height,
        version: canvasData.version,
        objects: []
    };

    if (canvasData.objects && Array.isArray(canvasData.objects)) {
        cleanJson.objects = canvasData.objects
            .filter((obj: any) => obj.type !== 'Image') // Remove all images
            .map((obj: any) => {
                const clean: any = {
                    type: obj.type,
                    left: obj.left,
                    top: obj.top,
                    width: obj.width,
                    height: obj.height,
                    angle: obj.angle || 0,
                    opacity: obj.opacity || 1,
                    scaleX: obj.scaleX || 1,
                    scaleY: obj.scaleY || 1,
                };

                // For text objects, save text properties
                if (obj.type === 'i-text' || obj.type === 'text') {
                    clean.text = obj.text;
                    clean.fontSize = obj.fontSize;
                    clean.fontFamily = obj.fontFamily;
                    clean.fill = obj.fill;
                    clean.fontWeight = obj.fontWeight;
                    clean.fontStyle = obj.fontStyle;
                    clean.textAlign = obj.textAlign;
                    clean.lineHeight = obj.lineHeight;
                    clean.charSpacing = obj.charSpacing;
                }

                // For shapes, keep fill and stroke
                if (obj.type !== 'i-text' && obj.type !== 'text') {
                    clean.fill = obj.fill;
                    clean.stroke = obj.stroke;
                    clean.strokeWidth = obj.strokeWidth;
                }

                return clean;
            });
    }

    return cleanJson;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, canvas_json, template_url } = body;

        if (!name || !canvas_json) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Extract ONLY JSON data (no images)
        const cleanDesignJson = extractDesignJson(canvas_json, template_url);
        const jsonString = JSON.stringify(cleanDesignJson);

        const sizeKB = Math.round(jsonString.length / 1024);
        console.log(`✅ Saving design: "${name}" | Size: ${sizeKB}KB | Template: ${template_url}`);

        const [result] = await pool.query(
            'INSERT INTO saved_designs (name, canvas_json) VALUES (?, ?)',
            [name, jsonString]
        );

        const insertResult = result as { insertId: number };
        return NextResponse.json({ 
            success: true, 
            id: insertResult.insertId,
            message: `Design saved successfully (${sizeKB}KB)`,
            data: cleanDesignJson
        });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
    }
}
