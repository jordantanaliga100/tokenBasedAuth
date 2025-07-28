import app from "./app.js";
import { connectMysql } from "./db/mysql/mysql.js";

// SERVER INSTANCE
const port = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    // call db instance here...
    await connectMysql();
    // await connectPostgres(process.env.POSTGRES_CONN_STRING as string);
    // await connectMongoDB(process.env.MONGODB_CONN_STRING as string);

    app.listen(port, "0.0.0.0", () => {
      console.log("Server started at " + port + " and connected to DB !!");
    });
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit process if DB connection fails
  }
};
start();
