const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret'; // Weak secret key

// Vulnerable Login Route (SQL Injection)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // VULNERABILITY: SQL Injection
    // Direct string concatenation allows attackers to bypass authentication
    // Example payload: "admin' --"
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log("Executing Query:", query); // Log for educational purposes

    db.get(query, (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // VULNERABILITY: Weak JWT
        // 1. Weak secret 'secret'
        // 2. Sensitive data in payload (password)
        // 3. Simple signing
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.isAdmin ? 'admin' : 'user',
            password: user.password // LEAKING PASSWORD IN TOKEN!
        }, JWT_SECRET);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.isAdmin ? 'admin' : 'user'
            }
        });
    });
});

module.exports = router;
