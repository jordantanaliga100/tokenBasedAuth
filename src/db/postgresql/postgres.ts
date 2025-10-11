// // ✅ ✅ ✅ For Raw Sql Config
// 🚀 (optional fallback if not using ORM)
import { Pool } from "pg";

let db: Pool;
export const connectPostgres = async (DB_URI: string) => {
  try {
    db = new Pool({
      connectionString: DB_URI,
    });

    const client = await db.connect();

    // test connection
    const res = await client.query("SELECT datname FROM pg_database;");
    console.log(`✅ Postgres Databases:`, res.rows);
    client.release();

    return db;
  } catch (error: any) {
    console.error("❌ PostgreSQL Error:", error.message);
    throw error;
  }
};

export const getDb = (): Pool => {
  if (!db)
    throw new Error("Database not initialized. Call connectPostgres() first.");
  return db;
};
