# GitHub Profile Analyzer API

A simple Node.js + Express API that fetches public GitHub profile data using the GitHub API and stores it in a MySQL database.

## Features

* Fetch GitHub user profile using username
* Store user insights in MySQL
* Update existing users automatically
* Fetch all stored users
* Fetch a single stored user
* REST API architecture
* Environment variable support using `.env`

---

## Tech Stack

* Node.js
* Express.js
* MySQL
* mysql2
* GitHub Public API
* dotenv

---

# API Endpoints

## Home Route

```http
GET /
```

Response:

```json
API is running...
```

---

## Fetch GitHub User

```http
GET /api/fetch/:username
```

Example:

```http
GET /api/fetch/octocat
```

This endpoint:

* Fetches data from GitHub API
* Stores data in MySQL
* Updates existing record if user already exists

---

## Fetch All Users

```http
GET /api/fetch-all
```

---

## Fetch Single User From Database

```http
GET /api/fetch-user/:username
```

Example:

```http
GET /api/fetch-user/octocat
```

---

# Project Setup

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

Move into the project folder:

```bash
cd YOUR_REPOSITORY_NAME
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create MySQL Database

Create database:

```sql
CREATE DATABASE testdb;
```

Use database:

```sql
USE testdb;
```

Create table:

```sql
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

---

## 4. Create `.env` File

Create a `.env` file in the root directory:

```env
PORT=8000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=testdb
```

---

## 5. Start Server

Using Node:

```bash
npm start
```

Using Nodemon:

```bash
npm run dev
```

Server will run at:

```bash
http://localhost:8000
```

---

# Example Response

```json
{
  "username": "octocat",
  "name": "The Octocat",
  "followers": 100,
  "following": 5,
  "publicRepos": 8,
  "avatar": "https://...",
  "bio": "GitHub mascot",
  "accountCreated": "2011-01-25"
}
```

---

# Folder Structure

```bash
project/
│
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
```

---

# License

MIT License
