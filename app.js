import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Use PORT from .env
const PORT = process.env.PORT || 8000;

// Global DB connection variable
let db;

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Home Route
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.send("API is running...");
});

/*
|--------------------------------------------------------------------------
| Fetch GitHub User + Store in MySQL
|--------------------------------------------------------------------------
*/
app.get("/api/fetch/:username", async (req, res) => {
  try {
    // Extract username from params
    const username = req.params.username;

    // Fetch data from GitHub API
    const result = await fetch(
      `https://api.github.com/users/${username}`
    );

    // Convert response to JSON
    const data = await result.json();

    // Handle invalid GitHub username
    if (data.message === "Not Found") {
      return res.status(404).json({
        message: "GitHub user not found",
      });
    }

    // Create custom object
    const insights = {
      username: data.login,
      name: data.name,
      followers: data.followers,
      following: data.following,
      publicRepos: data.public_repos,
      avatar: data.avatar_url,
      bio: data.bio,
      accountCreated: data.created_at.split("T")[0],
    };

    // Insert into database
    await db.execute(
      `
      INSERT INTO users
      (
        username,
        name,
        followers,
        following,
        publicRepos,
        avatar,
        bio,
        accountCreated
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        followers = VALUES(followers),
        following = VALUES(following),
        publicRepos = VALUES(publicRepos),
        avatar = VALUES(avatar),
        bio = VALUES(bio),
        accountCreated = VALUES(accountCreated)
      `,
      [
        insights.username,
        insights.name,
        insights.followers,
        insights.following,
        insights.publicRepos,
        insights.avatar,
        insights.bio,
        insights.accountCreated,
      ]
    );

    // Send response
    res.json(insights);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Fetch All Users
|--------------------------------------------------------------------------
*/
app.get("/api/fetch-all", async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM users"
    );

    res.json(rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Fetch Single User
|--------------------------------------------------------------------------
*/
app.get("/api/fetch-user/:username", async (req, res) => {
  try {

    const username = req.params.username;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // User not found in DB
    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found in database",
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Start Server + Connect DB
|--------------------------------------------------------------------------
*/
app.listen(PORT, async () => {
  try {

    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connection to DB successful");

    console.log(`Server listening at port ${PORT}`);

  } catch (error) {
    console.log("DB connection failed");

    console.log(error);
  }
});