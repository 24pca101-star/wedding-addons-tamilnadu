import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, canvas_json, preview_image } = body;

        if (!name || !canvas_json) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [result] = await pool.query(
            'INSERT INTO saved_designs (name, canvas_json, preview_image) VALUES (?, ?, ?)',
            [name, JSON.stringify(canvas_json), preview_image]
        );

        return NextResponse.json({ success: true, id: (result as any).insertId });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
    }
}
