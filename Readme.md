# 🌐 Session-Based Authentication with Express and TypeScript (PostgreSQL)

A simple Node.js application demonstrating **custom session-based authentication** using **Express**, **TypeScript**, and **PostgreSQL**. User sessions are manually stored in the database for full control and flexibility.

---

## 🚀 Features

- ✅ User registration and login
- 🍪 Custom session management (no `express-session`)
- 🔐 HTTP-only Cookies for session tracking
- ⏳ Session expiration with auto-extension on user activity
- 🧠 TypeScript for type safety
- 📁 Organized project structure
- 🌱 Environment variable support (`dotenv`)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL, Mysql, MongoDB
- dotenv

---

## 📦 Installation

```bash
git clone https://github.com/jordantanaliga100/sessionBasedAuth
cd sessionBasedAuth
npm install
```

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
        ME["📥 Request /me with Cookie"]
        OUT["🚪 Request /logout with Cookie"]
    end

    %% SERVER
    subgraph SERVER [🖥️ API Server]
        direction TB

        %% Register
        REG --> REG_VALIDATE["✅ Validate Registration Data"]
        REG_VALIDATE -- ❌ Invalid --> REG_ERR["🚫 Return 400 Bad Request"]
        REG_VALIDATE -- ✅ Valid --> REG_USERS["📦 Insert into users table"]
        REG_USERS --> REG_ACCOUNTS["🔐 Insert into accounts table"]
        REG_ACCOUNTS --> REG_DONE["🎉 Return 201 Created"]

        %% Login
        LOG --> LOG_VERIFY["🔍 Verify email and password"]
        LOG_VERIFY -- ❌ Invalid --> LOG_ERR["🚫 Return 401 Unauthorized"]
        LOG_VERIFY -- ✅ Valid --> LOG_SESSION["🗄️ Insert into sessions table"]
        LOG_SESSION --> LOG_COOKIE["🍪 Set-Cookie: session_id (HttpOnly)"]
        LOG_COOKIE --> LOG_DONE["✅ Return 200 OK with User Data"]

        %% Me
        ME --> ME_VALIDATE["🔍 Validate session_id from Cookie"]
        ME_VALIDATE -- ❌ Invalid --> ME_ERR["🚫 Return 401 Unauthorized"]
        ME_VALIDATE -- ✅ Valid --> ME_CHECK_EXP["⏳ Check if session expired"]
        ME_CHECK_EXP -- ❌ Expired --> ME_ERR
        ME_CHECK_EXP -- ✅ Active --> ME_EXTEND["♻️ Extend expires_at in sessions table"]
        ME_EXTEND --> ME_DONE["📤 Return User Data"]

        %% Logout
        OUT --> OUT_DELETE["🗑️ Delete session in sessions table"]
        OUT_DELETE --> OUT_CLEAR["🧹 Clear session_id Cookie"]
        OUT_CLEAR --> OUT_DONE["✅ Return 200 OK Logged Out"]
    end

    %% DATABASE
    subgraph DB [🗄️ PostgreSQL Database]
     direction RL
        USERS["📁 users"]
        ACCOUNTS["📁 accounts"]
        SESSIONS["📁 sessions"]
    end

    %% DB Interactions
    REG_USERS --> USERS
    REG_ACCOUNTS --> ACCOUNTS
    LOG_SESSION --> SESSIONS
    ME_VALIDATE --> SESSIONS
    ME_EXTEND --> SESSIONS
    OUT_DELETE --> SESSIONS
```

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
