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

// 🏹🏹🏹🏹 SIMULATION  !
// import express from "express";
// import session from "express-session";

// const app = express();

// const createStore = async () => {
//   const mysqlSession = (await import("express-mysql-session")).default;
//   const MySQLStore = mysqlSession(session as any);

//   const store = new MySQLStore({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "secret",
//     database: "mydb",
//   });

//   app.use(
//     session({
//       secret: "keyboard cat",
//       resave: false,
//       saveUninitialized: false,
//       store,
//       cookie: { maxAge: 1000 * 60 * 60 },
//     })
//   );

//   app.get("/", (req, res) => {
//     if (!req.session.views) req.session.views = 1;
//     else req.session.views++;
//     res.send(`Hello! You have visited ${req.session.views} times.`);
//   });

//   app.listen(3000, () =>
//     console.log("✅ Server running on http://localhost:3000")
//   );
// };

// // 🔥 run async init
// createStore();
