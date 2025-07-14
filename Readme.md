# 🪪 Token-Based Authentication with Express and TypeScript

A simple Node.js application demonstrating **token-based authentication** using **Express**, **TypeScript**, and **PostgreSQL**. Tokens (JWT) are used for stateless authentication.

---

## 🚀 Features

- ✅ User registration and login
- 🔐 Token-based authentication using **JWT (JSON Web Tokens)**
- 🧠 TypeScript for type safety
- 📁 Organized project structure
- 🌱 Environment variable support (`dotenv`)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT (`jsonwebtoken`)
- bcrypt

---

## 📦 Installation

```bash
git clone https://github.com/your-username/token-auth-example
cd token-auth-example
npm install
cp .env.example .env
npm run dev
```

🔑 Token-Based Authentication (with JWT + PostgreSQL)
🗺️ Flowchart
🧑‍💻 Token-Based Auth Flow (Register, Login, Access, Refresh)

```mermaid
flowchart TD
    %% CLIENT
    subgraph CLIENT [Frontend Client]
        direction TB
        REG["Register: full_name, email, password"]
        LOG["Login: email, password"]
        API_REQ["Request /me with JWT"]
        REFRESH["Request /refresh with Refresh Token"]
        OUT["Request /logout"]
    end

    %% SERVER
    subgraph SERVER [API Server]
        direction TB

        %% Register
        REG --> REG_VALIDATE["Validate Registration Data"]
        REG_VALIDATE -- Invalid --> REG_ERR["Return 400 Bad Request"]
        REG_VALIDATE -- Valid --> REG_HASH["Hash Password - bcrypt"]
        REG_HASH --> REG_SAVE["Insert into users table"]
        REG_SAVE --> REG_DONE["Return 201 Created"]

        %% Login
        LOG --> LOG_VERIFY["Verify email and password"]
        LOG_VERIFY -- Invalid --> LOG_ERR["Return 401 Unauthorized"]
        LOG_VERIFY -- Valid --> LOG_GEN_TOKEN["Generate Access & Refresh Tokens"]
        LOG_GEN_TOKEN --> LOG_SET_COOKIE["Set-Cookie for refresh token (optional)"]
        LOG_SET_COOKIE --> LOG_DONE["Return 200 OK with Access Token"]

        %% Access Protected Route
        API_REQ --> API_VALIDATE["Verify JWT Signature & Expiration"]
        API_VALIDATE -- Invalid --> API_ERR["Return 401 Unauthorized"]
        API_VALIDATE -- Valid --> API_DONE["Return User Data"]

        %% Refresh Token
        REFRESH --> REFRESH_VERIFY["Validate Refresh Token"]
        REFRESH_VERIFY -- Invalid --> REFRESH_ERR["Return 401 Unauthorized"]
        REFRESH_VERIFY -- Valid --> REFRESH_NEW["Generate New Access Token"]
        REFRESH_NEW --> REFRESH_DONE["Return 200 OK with New Token"]

        %% Logout
        OUT --> OUT_REVOKE["Revoke Refresh Token (DB delete or blacklist)"]
        OUT_REVOKE --> OUT_DONE["Return 200 OK Logged Out"]
    end

    %% DATABASE
    subgraph DB [PostgreSQL Database]
        USERS["users"]
        REFRESH_TOKENS["refresh_tokens"]
    end

    %% DB Interactions
    REG_SAVE --> USERS
    LOG_VERIFY --> USERS
    REFRESH_VERIFY --> REFRESH_TOKENS
    REFRESH_NEW --> REFRESH_TOKENS
    OUT_REVOKE --> REFRESH_TOKENS

```
