# 🧩 NET Template (Node Express TypeScript Template)

A production-ready **Node.js + Express + TypeScript** template designed for scalability, flexibility, and maintainability.  
Built with clean architecture principles, this template includes built-in integrations for authentication, databases, and ORMs — so you can jump straight into building your app instead of boilerplate setup.

---

## 🚀 Features

### 🔐 Authentication

- **Session-based authentication** with Redis session store
- **Token-based authentication** using JWT
- Helper utilities to easily switch between auth modes

### 🗄️ Database Support

Supports three major databases out of the box:

- 🟢 **MongoDB**
- 🟣 **PostgreSQL**
- 🟡 **MySQL**

Each database folder includes placeholders for both **Prisma** and **TypeORM** setups, so you can pick your ORM of choice.

### ⚙️ ORM Integrations

- 🧱 **Prisma** – modern TypeScript ORM, ready for relational and non-relational databases
- 🧩 **TypeORM** – powerful ORM for traditional SQL databases

### 💡 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **Redis** for session management
- **JWT** for stateless authentication
- **Helmet**, **CORS**, **dotenv**, and other production-ready middlewares
- **Docker** + **Docker Compose** for consistent dev and prod environments

---

## 📁 Folder Structure

```bash
./
├── docker-compose.dev.yml          # Docker Compose for development
├── docker-compose.prod.yml         # Docker Compose for production
├── docker-compose.sample.yml       # Sample Docker Compose template
├── Dockerfile                      # Docker build configuration
│
├── src/
│   ├── app/
│   │   ├── auth/                   # Auth module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   └── users/                  # Placeholder for user module
│   │
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server entry point
│   │
│   ├── class/
│   │   └── Error.ts                # Custom error class
│   │
│   ├── config/                     # Environment and app configs
│   │
│   ├── db/
│   │   ├── mongodb/
│   │   │   └── mongodb.ts
│   │   ├── mysql/
│   │   │   ├── mysql.ts
│   │   │   ├── prisma/             # Prisma integration for MySQL
│   │   │   └── typeorm/            # TypeORM integration for MySQL
│   │   ├── postgres/
│   │   │   ├── postgres.ts
│   │   │   ├── prisma/             # Prisma integration for PostgreSQL
│   │   │   └── typeorm/            # TypeORM integration for PostgreSQL
│   │   └── redis/
│   │       └── redis.config.ts     # Redis connection and session config
│   │
│   ├── dto/
│   │   └── user.dto.ts
│   │
│   ├── helpers/
│   │   └── mysql.config.ts
│   │
│   ├── middlewares/
│   │   ├── 404.ts                  # Not-found middleware
│   │   ├── AuthGuards.ts           # Auth guards (JWT/session validation)
│   │   └── Exception.ts            # Global error handler
│   │
│   ├── types/
│   │   ├── global.d.ts
│   │   ├── request-types.ts
│   │   ├── response-types.ts
│   │   └── session.d.ts
│   │
│   └── utils/
│       ├── hashPass.ts
│       ├── initAuth.ts
│       ├── setSessionInCookie.ts
│       └── setTokenInCookie.ts
│
├── tsconfig.json
└── .env.sample                     # Sample environment config
---
```
