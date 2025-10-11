export const mysqlConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "secret",
  database: process.env.MYSQL_DATABASE || "mydb",
  connectionLimit: 10,
};
