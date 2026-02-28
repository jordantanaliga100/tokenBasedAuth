import { Pool } from 'pg'

export const pool = new Pool({
    host: process.env.PG_HOST || 'postgres',
    user: process.env.PG_USER || 'admin',
    password: process.env.PG_PASSWORD || 'secret',
    port: Number(process.env.PG_PORT) || 5432,
    max: 10, // connection pool limit
    idleTimeoutMillis: 30000, // 30s idle timeout
    connectionTimeoutMillis: 2000, // 2s connect timeout
})

export const connectPostgres = async () => {
    try {
        const client = await pool.connect()
        console.log('✅ Connected to PostgreSQL!')
        client.release() // release immediately after test
        return pool
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ PostgreSQL Connection Error:', error?.message)
        } else {
            console.error('❌ PostgreSQL Connection Error:', error)
            throw error
        }
    }
}
