// const sample_connection_string = mysql://root:password123@mysql:3306/mydb
import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

export const connectMysql = async (DB_URI: string) => {
  try {
    const connection = await mysql.createConnection(DB_URI);

    // test connection
    const [rows] = await connection.query(`SHOW DATABASES`);
    console.log(`✅ Mysql Databases:`, rows);

    return connection;
  } catch (error: any) {
    console.error("❌ MySQL Error:", error?.message);
    throw error; // propagate the error so server doesn’t start if DB fails
  }
};
