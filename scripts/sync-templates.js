import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function syncTemplates() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    try {
        console.log('Connected to MySQL server.');

        // 1. Truncate the table to remove "previous files" (records)
        console.log('Cleaning up templates table...');
        await connection.query('DELETE FROM templates');
        await connection.query('ALTER TABLE templates AUTO_INCREMENT = 1');

        // 2. Define the 5 templates based on the current public/templates files
        const templates = [
            {
                name: 'Rose Gold Floral',
                desc: 'Soft pink floral welcome banner with elegant rose gold accents, perfect for traditional weddings.',
                psd: '/templates/design-1.psd',
                img: '/templates/design-1.jpg'
            },
            {
                name: 'Winter Watercolor',
                desc: 'Elegant winter wedding banner featuring deep blue watercolor textures and lush greenery.',
                psd: '/templates/design-2.psd',
                img: '/templates/design-2.jpg'
            },
            {
                name: 'Winter Photo Invitation',
                desc: 'Modern winter-themed invitation with cool blue accents and a central photo placeholder.',
                psd: '/templates/design-3.psd',
                img: '/templates/design-3.jpg'
            },
            {
                name: 'Romantic Hearts',
                desc: 'Peach-toned wedding banner adorned with romantic doves, golden bells, and floral corner details.',
                psd: '/templates/design-4.psd',
                img: '/templates/design-4.jpg'
            },
            {
                name: 'Premium Gold Photo',
                desc: 'Luxury gold and white banner with elegant floral outlines and a central photo frame.',
                psd: '/templates/design-5.psd',
                img: '/templates/design-5.jpg'
            },
            {
                name: 'Artistic Yellow Floral',
                desc: 'Artistic floral banner featuring bold yellow blossoms and refined typography.',
                psd: '/templates/design-6.psd',
                img: '/templates/design-6.jpg'
            }
        ];
        // 3. Insert the new records
        for (const t of templates) {
            console.log(`Inserting ${t.name}...`);
            await connection.query(
                'INSERT INTO templates (name, description, template_path, image_path) VALUES (?, ?, ?, ?)',
                [t.name, t.desc, t.psd, t.img]
            );
        }

        console.log('Successfully synchronized 6 templates with the database.');

    } catch (error) {
        console.error('Synchronization failed:', error);
    } finally {
        await connection.end();
    }
}

syncTemplates();
