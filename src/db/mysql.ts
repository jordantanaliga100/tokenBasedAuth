// const sample_connection_string = mysql://root:password123@mysql:3306/mydb
import "dotenv/config";
import mysql from "mysql2/promise";
import { runSeeders } from "./seeders/mysql-seed.js";

let pool: mysql.Pool | null = null;
export const connectMysql = async (DB_URI?: string | null) => {
  if (pool) {
    console.warn(
      "⚠️ MySQL pool is already initialized. Skipping re-initialization."
    );
    return pool;
  }
  try {
    // Step 1: Connect without database to create it if needed
    const tempPool = mysql.createPool({
      host: process.env.MYSQL_DB_HOST,
      port: Number(process.env.MYSQL_DB_PORT),
      user: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASS,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await tempPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DB_NAME}\`;`
    );
    console.log(`✅ Database '${process.env.MYSQL_DB_NAME}' checked/created.`);

    // Step 2: Close tempPool (optional) and create main pool with DB set
    await tempPool.end();

    pool = mysql.createPool({
      host: process.env.MYSQL_DB_HOST,
      port: Number(process.env.MYSQL_DB_PORT),
      user: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASS,
      database: process.env.MYSQL_DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    // test connection
    const [rows] = await pool.query(`SHOW DATABASES`);
    console.log(`✅ Mysql Databases:`, rows);

    await runSeeders(pool);

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
