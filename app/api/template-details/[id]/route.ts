import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const [rows] = await pool.query(
            'SELECT * FROM templates WHERE id = ?',
            [id]
        ) as [Record<string, unknown>[], unknown];

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Map template_path to psd_path for frontend compatibility
        const { template_path, ...rest } = rows[0] as Record<string, unknown>;
        return NextResponse.json({ ...rest, psd_path: template_path });
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch template details' }, { status: 500 });
    }
}
