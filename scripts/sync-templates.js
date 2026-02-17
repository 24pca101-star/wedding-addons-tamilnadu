import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
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
            { name: 'Rose Gold Floral', desc: 'Soft pink floral themed traditional welcome banner with rose gold accents.', psd: '/templates/design-1.psd', img: '/templates/design1.jpg' },
            { name: 'Winter Watercolor', desc: 'Elegant winter wedding banner with deep blue watercolor and greenery.', psd: '/templates/design-2.psd', img: '/templates/design2.jpg' },
            { name: 'Winter Photo Invit', desc: 'Modern winter wedding invitation featuring blue accents and a center photo placeholder.', psd: '/templates/design-3.psd', img: '/templates/design3.jpg' },
            { name: 'Romantic Hearts', desc: 'Peach themed wedding banner with romantic doves, golden bells, and floral corners.', psd: '/templates/design-4.psd', img: '/templates/design4.jpg' },
            { name: 'Premium Gold Photo', desc: 'Classy gold and white wedding banner with elegant floral outlines and a central photo holder.', psd: '/templates/design-5.psd', img: '/templates/design5.jpg' },
            { name: 'Artistic Yellow Floral', desc: 'Artistic floral design with large yellow flowers and elegant typography.', psd: '/templates/design-6.psd', img: '/templates/design6.jpg' }
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
