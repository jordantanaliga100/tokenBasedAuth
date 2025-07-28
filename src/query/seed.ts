import { getPool } from "../db/mysql/mysql.js";

export async function createTables() {
  const pool = getPool()!;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS post (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      authorId INT,
      FOREIGN KEY (authorId) REFERENCES user(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comment (
      id INT PRIMARY KEY AUTO_INCREMENT,
      text TEXT NOT NULL,
      postId INT,
      authorId INT,
      FOREIGN KEY (postId) REFERENCES post(id),
      FOREIGN KEY (authorId) REFERENCES user(id)
    )
  `);

  console.log("Tables created successfully!");
}

export async function seedData() {
  const pool = getPool()!;

  try {
    await pool.query(`
      INSERT INTO user (name, email) VALUES 
      ('Juan Dela Cruz', 'juan@example.com'),
      ('Maria Clara', 'maria@example.com')
    `);

    await pool.query(`
      INSERT INTO post (title, content, authorId) VALUES 
      ('My First Post', 'This is the content of my first post.', 1),
      ('Hello World', 'Welcome to my blog!', 2)
    `);

    await pool.query(`
      INSERT INTO comment (text, postId, authorId) VALUES
      ('Great post!', 1, 2),
      ('Thanks for sharing.', 1, 1),
      ('Nice to meet you all!', 2, 1)
    `);

    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}
