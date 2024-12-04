const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1); // Exit the app if the database connection fails
    }
    console.log("Connected to MySQL database.");
});

// Helper function for validation
const validateUserInput = (name, email, password) => {
    if (!name || !email || !password) {
        return "Name, email, and password are required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    return null;
};

// API Endpoints

// Signup endpoint
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Validate user input
    const error = validateUserInput(name, email, password);
    if (error) {
        return res.status(400).send({ error });
    }

    // Insert user into the database
    db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err, results) => {
            if (err) {
                console.error("Error inserting user:", err.message);
                return res.status(500).send({ error: "Failed to register user." });
            }
            res.status(201).send({
                message: "User registered successfully.",
                userId: results.insertId,
            });
        }
    );
});

// Fetch all users
app.get("/users", (req, res) => {
    db.query("SELECT id, name, email, created_at FROM users", (err, results) => {
        if (err) {
            console.error("Error fetching users:", err.message);
            return res.status(500).send({ error: "Failed to retrieve users." });
        }
        res.status(200).send(results);
    });
});

// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).send({ error: "Route not found." });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
