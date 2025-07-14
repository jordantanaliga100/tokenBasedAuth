import { Pool } from "pg";

export const connectPostgres = async (DB_URI: string) => {
  try {
    const pool = new Pool({
      connectionString: DB_URI,
    });

    const client = await pool.connect();

    // test connection
    const res = await client.query("SELECT datname FROM pg_database;");
    console.log(`✅ Postgres Databases:`, res.rows);
    client.release();

    return pool;
  } catch (error: any) {
    console.error("❌ PostgreSQL Error:", error.message);
    throw error;
  }
};
