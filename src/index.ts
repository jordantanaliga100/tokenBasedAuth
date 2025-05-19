// IMPORTS
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { users } from "./app/constants/users.js";
import { connectDB } from "./config/connection.js";
import GlobalException from "./middlewares/GlobalException.js";
import NotFound from "./middlewares/NotFound.js";

dotenv.config();

// ENV CONFIG
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? ".env.prod" : ".env.local";
dotenv.config({ path: envFile });
console.log(`✅ Loaded ${envFile}`);
console.log("... on " + nodeEnv + " environment 🚀");
const app = express();

// TOP MIDDLEWARES
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get("/", (req: Request, res: Response) => {
  // throw new Error("Testing gin index");
  res.status(200).json({
    msg: "All Users",
    data: users.slice(0, 5),
  });

  // res.send("Node_Express Server Alive 🛩️");
});
app.use("/api/v1/auth", () => {});
app.use("/api/v1/products", () => {});
app.use("/api/v1/services", () => {});
app.use("/api/v1/contact", () => {});
app.use("/api/v1/users", () => {});

// BOTTOM MIDDLEWARES
app.use(NotFound);
app.use(GlobalException);

// SERVER INSTANCE
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    app.listen(port, () => {
      console.log("Server started at " + port + " and connected to DB !!");
    });
  } catch (error) {
    console.log(error);
  }
};
start();

console.log("running on docker");
