// const sample_connection_string = mysql://root:password123@mysql:3306/mydb
import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
export const connectMysql = async (DB_URI: string) => {
  if (pool) {
    console.warn(
      "⚠️ MySQL pool is already initialized. Skipping re-initialization."
    );
    return pool;
  }
  try {
    pool = await mysql.createPool(DB_URI);

    // test connection
    const [rows] = await pool.query(`SHOW DATABASES`);
    console.log(`✅ Mysql Databases:`, rows);

    return pool;
  } catch (error: any) {
    console.error("❌ MySQL Error:", error?.message);
    throw error; // propagate the error so server doesn’t start if DB fails
  }
};

export const getPool = (): mysql.Pool | null | undefined => {
  if (!pool) {
    throw new Error("MySQL Pool not initialized. Call connectMysql first.");
  }
  return pool!;
};
