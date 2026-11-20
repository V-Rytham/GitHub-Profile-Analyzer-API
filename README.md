# GitHub Profile Analyzer API

> **Node.js & Express RESTful microservice that aggregates GitHub developer profiles, computes public repo metrics, and handles idempotent persistence with MySQL.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![REST API](https://img.shields.io/badge/REST-API-blue?style=flat-square)](https://restfulapi.net/)

---

## 📌 Why I Built This

I built this service to explore backend data synchronization between third-party external APIs (GitHub REST API v3) and relational databases:
- **Upsert / Idempotent Ingestion**: Handles automatic insertion of new developer profiles or updating existing records (`ON DUPLICATE KEY UPDATE` / conditional upsert) to prevent stale metrics.
- **Relational Schema**: Normalizes developer handles, repo counts, follower metrics, and timestamps in MySQL for fast querying.
- **Clean REST Design**: Predictable endpoints for on-demand profile scraping, batch listing, and individual record retrieval.

---

## 🏗️ System Flow

```mermaid
flowchart LR
    Client[Client / Frontend] -->|GET /api/fetch/:username| API[Express API Service]
    API -->|Fetch Public JSON| GitHub[GitHub REST API]
    GitHub -->|User Profile Data| API
    API -->|Upsert Record| MySQL[(MySQL Database: users)]
    MySQL -->|Persisted Record| API
    API -->|JSON Response| Client
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check (`"API is running..."`) |
| `GET` | `/api/fetch/:username` | Fetches live profile from GitHub, upserts into MySQL, and returns record |
| `GET` | `/api/fetch-all` | Lists all cached GitHub user profiles in the database |
| `GET` | `/api/fetch-user/:username` | Retrieves a single stored developer profile directly from MySQL |

### Example Payload (`GET /api/fetch/octocat`)
```json
{
  "username": "octocat",
  "name": "The Octocat",
  "followers": 15200,
  "following": 9,
  "publicRepos": 8,
  "avatar": "https://avatars.githubusercontent.com/u/583231?v=4",
  "bio": "GitHub mascot",
  "accountCreated": "2011-01-25"
}
```

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database Driver**: `mysql2/promise` (connection pooling & prepared statements)
- **Database**: MySQL 8.0+

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/V-Rytham/GitHub-Profile-Analyzer-API.git
cd GitHub-Profile-Analyzer-API
npm install
```

### 2. Configure Database & Environment
In MySQL, initialize your database and table:
```sql
CREATE DATABASE github_analyzer;
USE github_analyzer;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    followers INT,
    following INT,
    publicRepos INT,
    avatar TEXT,
    bio TEXT,
    accountCreated DATE
);
```

Create a `.env` file in the root directory:
```ini
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=github_analyzer
```

### 3. Start the Server
```bash
# Production mode
node app.js

# Or development with live reload
npm run dev
```

The API will listen at: `http://localhost:8000`

---

## 🧑‍💻 Author

**Rytham Maalpani**  
- Final Year Computer Science Undergraduate  
- GitHub: [@V-Rytham](https://github.com/V-Rytham)
