import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema/schema.ts", // ✅ path to your schema file
  out: "./src/drizzle/migrations", // ✅ output folder for generated migrations
  dialect: "postgresql", // ✅ PostgreSQL driver (required)
  dbCredentials: {
    host: "localhost", // 🔁 use "postgres-session" if running CLI inside Docker
    port: 5432,
    user: "admin",
    password: "secret",
    database: "auth",
    ssl: false,
  },
});
