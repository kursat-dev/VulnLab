const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.VERCEL
    ? path.join('/tmp', 'vulnlab.db')
    : path.resolve(__dirname, 'vulnlab.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database at ' + dbPath, err.message);
    } else {
        console.log('Connected to the SQLite database at ' + dbPath);
    }
});

// Initialize Database
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        isAdmin INTEGER DEFAULT 0
    )`);

    // Comments table (for Stored XSS)
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Documents table (for IDOR)
    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        content TEXT
    )`);

    // Seed Data
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding database...");
            // Admin user
            db.run("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", ['admin', 'admin123', 1]);
            // Regular user
            db.run("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", ['user', 'user123', 0]);

            // Seed Documents
            db.run("INSERT INTO documents (user_id, title, content) VALUES (?, ?, ?)", [1, 'Admin Secrets', 'This is top secret admin data.']);
            db.run("INSERT INTO documents (user_id, title, content) VALUES (?, ?, ?)", [2, 'User Notes', 'Just some regular user notes.']);

            // Seed Comments
            db.run("INSERT INTO comments (user_id, content) VALUES (?, ?)", [2, 'Hello world! This is a safe comment.']);
        }
    });
});

module.exports = db;
