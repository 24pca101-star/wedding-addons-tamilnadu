const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    });

    try {
        console.log('Connected to MySQL server.');

        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
        console.log(`Database '${process.env.MYSQL_DATABASE}' created or already exists.`);

        // Switch to Database
        await connection.changeUser({ database: process.env.MYSQL_DATABASE });

        // Read Schema SQL
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split and Execute Queries
        const queries = schemaSql.split(';').filter(q => q.trim());
        for (const query of queries) {
            if (query.trim()) {
                await connection.query(query);
            }
        }
        console.log('Tables created and data seeded successfully.');

    } catch (error) {
        console.error('Setup failed:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();
