import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config({ path: '.env.local' });

async function addTemplates() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    try {
        const templates = [
            { id: 4, name: 'Floral Elegance', description: 'Traditional floral design', psd: '/templates/design-4.psd', img: '/templates/design-4.jpg' },
            { id: 5, name: 'Royal Wedding', description: 'Premium royal design', psd: '/templates/design-5.psd', img: '/templates/design-5.jpg' },
            { id: 6, name: 'Modern Minimalist', description: 'Sleek and modern layout', psd: '/templates/design-6.psd', img: '/templates/design-6.jpg' }
        ];

        for (const t of templates) {
            // Check if exists
            const [existing] = await connection.query('SELECT id FROM templates WHERE id = ?', [t.id]);

            if (existing.length === 0) {
                console.log(`Inserting template ${t.id}...`);
                await connection.query(
                    'INSERT INTO templates (id, name, description, template_path, image_path) VALUES (?, ?, ?, ?, ?)',
                    [t.id, t.name, t.description, t.psd, t.img]
                );
            } else {
                console.log(`Template ${t.id} already exists, updating paths...`);
                await connection.query(
                    'UPDATE templates SET template_path = ?, image_path = ? WHERE id = ?',
                    [t.psd, t.img, t.id]
                );
            }
        }

        console.log('All templates processed successfully.');
    } catch (err) {
        console.error('Error adding templates:', err);
    } finally {
        await connection.end();
    }
}

addTemplates();
