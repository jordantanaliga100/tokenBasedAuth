import mysql from "mysql2/promise";

export const runSeeders = async (pool: mysql.Pool) => {
  // Create tables (using MySQL compatible SQL)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      provider_account_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_provider_account (provider, provider_account_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 🩸🩸🩸 express-sessions handles the table creation 🩸🩸🩸

  // await pool.query(`
  //   CREATE TABLE IF NOT EXISTS sessions (
  //     id CHAR(36) PRIMARY KEY,
  //     user_id CHAR(36) NOT NULL,
  //     session_token VARCHAR(255) UNIQUE NOT NULL,
  //     user_agent TEXT NOT NULL,
  //     ip_address VARCHAR(45) NOT NULL,
  //     expires_at TIMESTAMP NOT NULL,
  //     last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  //   );
  // `);

  console.log("✅ Seeder: Tables created!");
};
