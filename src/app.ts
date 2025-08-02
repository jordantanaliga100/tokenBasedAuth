// IMPORTS
import cors from "cors";
import dotenv from "dotenv";
import ejs from "ejs";
import express, { Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import AuthRoutes from "./app/auth/auth.route.js";
import AuthGuards from "./middlewares/AuthMiddleware.js";
import GlobalException from "./middlewares/GlobalException.js";
import NotFound from "./middlewares/NotFound.js";
dotenv.config();

// DIR CONFIG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log("filename", __filename);
// console.log("dirname", __dirname);

// ENV CONFIG
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? ".env.prod" : ".env.local";
dotenv.config({ path: envFile });
console.log(`✅ Loaded ${envFile}`);
console.log("... on " + nodeEnv + " environment 🚀");
const app = express();

// TOP MIDDLEWARES
app.engine("ejs", (ejs as any).__express);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
// app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

// VIEWS

// FRONTEND ROUTES
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", AuthGuards, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// BACKEND ROUTES
app.get("/", (req: Request, res: Response) => {
  res.send("Server Alive 🛩️");
});
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/products", AuthGuards, (req, res, next) => {
  const user = req.user;
  const sess = req.session;

  console.log("FROM AUTH GUARDS user 👮‍♂️", user);
  console.log("FROM AUTH GUARDS session 🌄", sess);
  res.send({
    msg: "Products Route",
    user,
    sess,
  });
});
app.use("/api/v1/services", () => {});
app.use("/api/v1/contact", () => {});
app.use("/api/v1/users", () => {});
app.use("/api/v1/posts", () => {});
app.use("/api/v1/comments", () => {});

// BOTTOM MIDDLEWARES
app.use(NotFound);
app.use(GlobalException);

export default app;
