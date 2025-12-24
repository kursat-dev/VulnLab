const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

// Middleware to verify token (but doesn't fix IDOR)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ error: "Failed to authenticate token" });
        req.userId = decoded.id;
        next();
    });
};

// VULNERABILITY: IDOR (Insecure Direct Object Reference)
// User can access ANY document by changing the :id parameter
// No check to see if document.user_id matches req.userId
router.get('/documents/:id', verifyToken, (req, res) => {
    const docId = req.params.id;

    // Using parameterized query to prevent SQLi here, highlighting IDOR specifically
    db.get("SELECT * FROM documents WHERE id = ?", [docId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "Document not found" });

        // VULNERABILITY: Missing authorization check
        // if (row.user_id !== req.userId) return res.status(403).send("Forbidden");

        res.json(row);
    });
});

// VULNERABILITY: Reflected XSS
// Returns search query directly in response without escaping
router.get('/search', (req, res) => {
    const query = req.query.q;

    // Simulating search results
    const results = [
        { id: 1, title: "Result 1 for " + query }, // Reflected input
        { id: 2, title: "Result 2 for " + query }
    ];

    // In a real API, XSS usually happens when the frontend renders this response insecurely (e.g., dangerouslySetInnerHTML)
    // OR if the API returns HTML directly.
    // For this API, we return JSON, but the education comes from the frontend handling.
    // However, to demonstrate API-level reflection (less common in JSON APIs but possible):

    res.json({
        query: query, // The frontend will likely render this raw
        results: results
    });
});

// VULNERABILITY: Stored XSS
// Stores comment without sanitization
router.post('/comments', verifyToken, (req, res) => {
    const { content } = req.body;

    db.run("INSERT INTO comments (user_id, content) VALUES (?, ?)", [req.userId, content], function (err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ id: this.lastID, message: "Comment added" });
    });
});

router.get('/comments', (req, res) => {
    db.all("SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});

module.exports = router;
