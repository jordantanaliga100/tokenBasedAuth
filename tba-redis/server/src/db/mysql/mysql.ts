import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'secret',
    database: process.env.MYSQL_DB || 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

export const connectMysql = async () => {
    try {
        const conn = await pool.getConnection()
        conn.release()
        console.log('✅ Connected to MySQL!')
        return pool
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('❌ MySQL Connection Error:', error.message)
        } else {
            console.error('❌ MySQL Connection Error:', error)
            throw new Error('Unknown MySQL connection error')
        }
    }
}
