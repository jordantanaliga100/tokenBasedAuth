import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ErrorClass } from "../class/ErrorClass.js";
import * as schema from "../drizzle/schema/schema.js";

let pool: Pool;
export const connectPostgres = (DB_URI: string) => {
  pool = new Pool({ connectionString: DB_URI });
  console.log("Postgres Connected 🚀");
  return drizzle(pool, { schema });
};

export const getPool = () => {
  if (!pool) throw new ErrorClass.ServiceUnavailable("Pool not initialized");
  return pool;
};
