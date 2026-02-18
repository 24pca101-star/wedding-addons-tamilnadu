import mysql from 'mysql2/promise';

console.log('Database Config:', {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD ? '********' : 'empty'
});

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Increase max allowed packet size for large canvas data
    enableKeepAlive: true,
    init: async (conn) => {
        await conn.query("SET SESSION max_allowed_packet = 1024 * 1024 * 16"); // 16 MB
    }
});

export default pool;
