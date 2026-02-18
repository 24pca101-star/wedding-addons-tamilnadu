import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('id');

    if (!designId) {
        return NextResponse.json({ error: 'Missing design ID' }, { status: 400 });
    }

    try {
        const [rows]: any = await pool.query(
            'SELECT id, name, canvas_json, created_at FROM saved_designs WHERE id = ?',
            [designId]
        );

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'Design not found' }, { status: 404 });
        }

        const design = rows[0];
        const canvasJson = typeof design.canvas_json === 'string' 
            ? JSON.parse(design.canvas_json) 
            : design.canvas_json;

        return NextResponse.json({
            success: true,
            id: design.id,
            name: design.name,
            canvas_json: canvasJson,
            created_at: design.created_at
        });
    } catch (error) {
        console.error('Error loading design:', error);
        return NextResponse.json({ error: 'Failed to load design' }, { status: 500 });
    }
}
