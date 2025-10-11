import mysqlSession from "express-mysql-session";
import session from "express-session";
import mysql, { Pool } from "mysql2";
import { mysqlConfig } from "../config/config.js";

const MySQLStore = mysqlSession(session as any);
export const createSessionStore = () => {
  const pool: Pool = mysql.createPool(mysqlConfig);
  return new MySQLStore(
    {
      clearExpired: true,
      checkExpirationInterval: 10000,
      schema: {
        tableName: "sessions",
        columnNames: {
          session_id: "id",
          expires: "expires_at",
          data: "session_data",
        },
      },
    },
    pool
  );
};
