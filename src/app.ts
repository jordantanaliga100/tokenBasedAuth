// IMPORTS
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import CommentRoutes from "./app/comment/comment.route.js";
import PostRoutes from "./app/post/post.route.js";
import UserRoutes from "./app/user/user.route.js";
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
  res.send("Server Alive 🛩️");
});
app.use("/api/v1/auth", () => {});
app.use("/api/v1/products", () => {});
app.use("/api/v1/services", () => {});
app.use("/api/v1/contact", () => {});
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/posts", PostRoutes);
app.use("/api/v1/comments", CommentRoutes);

// BOTTOM MIDDLEWARES
app.use(NotFound);
app.use(GlobalException);

export default app;
