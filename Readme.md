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
- PostgreSQL
- dotenv

---

## 📦 Installation

```bash
git clone https://github.com/your-username/session-auth-postgres.git
cd session-auth-postgres
npm install

```

### Flowchart

```mermaid
flowchart TD
%% CLIENT
subgraph CLIENT [Frontend Client]
direction TB
REG[Register: full_name, email, password]
LOG[Login: email, password]
ME[Request /me with Cookie]
OUT[Request /logout with Cookie]
end

    %% SERVER
    subgraph SERVER [API Server]
        direction TB

        %% Register
        REG --> REG_VALIDATE[Validate Registration Data]
        REG_VALIDATE -- Invalid --> REG_ERR[Return 400 Bad Request]
        REG_VALIDATE -- Valid --> REG_USERS[Insert into users table]
        REG_USERS --> REG_ACCOUNTS[Insert into accounts table]
        REG_ACCOUNTS --> REG_DONE[Return 201 Created]

        %% Login
        LOG --> LOG_VERIFY[Verify email and password]
        LOG_VERIFY -- Invalid --> LOG_ERR[Return 401 Unauthorized]
        LOG_VERIFY -- Valid --> LOG_SESSION[Insert session_id + expires_at into sessions table]
        LOG_SESSION --> LOG_COOKIE[Set HTTP-only Cookie: session_id]
        LOG_COOKIE --> LOG_DONE[Return 200 OK with User Data]

        %% Me
        ME --> ME_VALIDATE[Read session_id from Cookie]
        ME_VALIDATE -- Not Found --> ME_ERR[Return 401 Unauthorized]
        ME_VALIDATE --> ME_CHECK_EXP[Check session validity + expiration]
        ME_CHECK_EXP -- Expired --> ME_ERR
        ME_CHECK_EXP -- Valid --> ME_EXTEND[Extend expires_at in sessions table]
        ME_EXTEND --> ME_DONE[Return User Data]

        %% Logout
        OUT --> OUT_DELETE[Delete session_id from sessions table]
        OUT_DELETE --> OUT_CLEAR[Clear session_id Cookie]
        OUT_CLEAR --> OUT_DONE[Return 200 OK Logged Out]
    end

    %% DATABASE
    subgraph DB [PostgreSQL Database]
        USERS[(users)]
        ACCOUNTS[(accounts)]
        SESSIONS[(sessions)]
    end

    %% DB Interactions
    REG_USERS --> USERS
    REG_ACCOUNTS --> ACCOUNTS
    LOG_SESSION --> SESSIONS
    ME_VALIDATE --> SESSIONS
    ME_EXTEND --> SESSIONS
    OUT_DELETE --> SESSIONS
```
