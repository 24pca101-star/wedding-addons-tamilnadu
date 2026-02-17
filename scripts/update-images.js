import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(new URL(import.meta.url).pathname, '../.env.local') });

async function updateImages() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    try {
        console.log('Connected to MySQL server.');

        const updates = [
            { id: 1, image: '/templates/design1.jpg' },
            { id: 2, image: '/templates/design2.jpg' },
            { id: 3, image: '/templates/design3.jpg' },
            { id: 4, image: '/templates/design4.jpg' },
            { id: 5, image: '/templates/design5.jpg' },
            { id: 6, image: '/templates/design6.jpg' }
        ];

        for (const update of updates) {
            await connection.execute(
                'UPDATE templates SET image_path = ? WHERE id = ?',
                [update.image, update.id]
            );
            console.log(`Updated template ${update.id} image to ${update.image}`);
        }

        console.log('All images updated successfully.');

    } catch (error) {
        console.error('Update failed:', error);
    } finally {
        await connection.end();
    }
}

updateImages();
