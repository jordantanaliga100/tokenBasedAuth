# 🌐 Token-Based Authentication with Express and TypeScript (PostgreSQL)

A simple Node.js application demonstrating **JWT (token-based) authentication** using **Express**, **TypeScript**, and **PostgreSQL**. Tokens are signed and verified without server-side sessions for a fully stateless architecture.

---

## 🚀 Features

- ✅ User registration and login
- 🔐 Access tokens (JWT) and refresh tokens
- 📦 Tokens stored in client-side (localStorage or in-memory)
- ⏳ Token expiration & refresh flow
- 🧠 TypeScript for type safety
- 📁 Organized project structure
- 🌱 Environment variable support (`dotenv`)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL, MySQL, MongoDB
- JWT (jsonwebtoken)
- dotenv

---

## 📦 Installation

````bash
git clone https://github.com/jordantanaliga100/tokenBasedAuth
cd tokenBasedAuth
npm install


🌐 Session-Based Authentication (with Cookies + PostgreSQL)
🗺️ Flowchart
🧑‍💻 Session-Based Auth Flow (Register, Login, Me, Logout)

```mermaid
flowchart TD
    %% CLIENT
    subgraph CLIENT [💻 Frontend Client]
        direction TB
        REG["📝 Register: full_name, email, password"]
        LOG["🔑 Login: email, password"]
        ME["📥 Request /me with Authorization: Bearer <token>"]
        REFRESH["♻️ Refresh token when expired"]
        OUT["🚪 Request /logout (invalidate refresh token)"]
    end

    %% SERVER
    subgraph SERVER [🖥️ API Server]
        direction TB

        %% Register
        REG --> REG_VALIDATE["✅ Validate Registration Data"]
        REG_VALIDATE -- ❌ Invalid --> REG_ERR["🚫 Return 400 Bad Request"]
        REG_VALIDATE -- ✅ Valid --> REG_USERS["📦 Insert into users table"]
        REG_USERS --> REG_ACCOUNTS["🔐 Hash password and save"]
        REG_ACCOUNTS --> REG_DONE["🎉 Return 201 Created"]

        %% Login
        LOG --> LOG_VERIFY["🔍 Verify email and password"]
        LOG_VERIFY -- ❌ Invalid --> LOG_ERR["🚫 Return 401 Unauthorized"]
        LOG_VERIFY -- ✅ Valid --> LOG_TOKENS["🔑 Generate Access & Refresh Tokens"]
        LOG_TOKENS --> LOG_DONE["✅ Return tokens and user data"]

        %% Me
        ME --> ME_VALIDATE["🔍 Verify Access Token (JWT)"]
        ME_VALIDATE -- ❌ Invalid --> ME_ERR["🚫 Return 401 Unauthorized"]
        ME_VALIDATE -- ✅ Valid --> ME_DONE["📤 Return User Data"]

        %% Refresh Token
        REFRESH --> REFRESH_VALIDATE["🔍 Verify Refresh Token"]
        REFRESH_VALIDATE -- ❌ Invalid --> REFRESH_ERR["🚫 Return 403 Forbidden"]
        REFRESH_VALIDATE -- ✅ Valid --> REFRESH_NEW["♻️ Issue new Access Token"]
        REFRESH_NEW --> REFRESH_DONE["📤 Return new token"]

        %% Logout
        OUT --> OUT_DELETE["🗑️ Invalidate refresh token (DB or blacklist)"]
        OUT_DELETE --> OUT_DONE["✅ Return 200 OK Logged Out"]
    end

    %% DATABASE
    subgraph DB [🗄️ Database]
     direction RL
        USERS["📁 users"]
        ACCOUNTS["📁 accounts"]
        REFRESH_TOKENS["📁 refresh_tokens"]
    end

    %% DB Interactions
    REG_USERS --> USERS
    REG_ACCOUNTS --> ACCOUNTS
    REFRESH_VALIDATE --> REFRESH_TOKENS
    OUT_DELETE --> REFRESH_TOKENS

````

### 🉐 Docker-Based Dev Setup

> This 👇

🔥 POSTGRESQL
docker run -d \
 --name mysql-con \
 -e MYSQL_ROOT_PASSWORD=secret \
 -e MYSQL_DATABASE=mydb \
 -e MYSQL_USER=admin \
 -e MYSQL_PASSWORD=secret \
 -p 3306:3306 \
 mysql

🔥 POSTGRESQL
docker run -d \
 --name postgres-con \
 -e POSTGRES_DB=mydb \
 -e POSTGRES_USER=admin \
 -e POSTGRES_PASSWORD=secret \
 -p 5432:5432 \
 postgres

🔥 MONGODB
docker run -d \
 --name mongo-con \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=secret \
 -e MONGO_INITDB_DATABASE=mydb \
 -p 27017:27017 \
 mongo

> or This 👇

```sh
> docker-compose -p app up -d
> docker-compose down
```
