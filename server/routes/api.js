const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const multer = require('multer');

// Configure multer for Unrestricted File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        // VULNERABILITY: No filename sanitization or extension check
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

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

    res.json({
        query: query,
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

// VULNERABILITY: Command Injection
// The system executes a shell command with unsanitized user input
router.post('/ping', (req, res) => {
    const { ip } = req.body;

    // Command sequence injection possible (e.g., "127.0.0.1; ls")
    const command = `ping -c 4 ${ip}`;

    exec(command, (error, stdout, stderr) => {
        res.json({
            command: command,
            output: stdout || stderr || error?.message
        });
    });
});

// VULNERABILITY: Local File Inclusion (LFI)
// The system reads a file from the disk based on a user-provided path
router.get('/logs', (req, res) => {
    const file = req.query.file || 'logs.txt';
    const filePath = path.join(__dirname, '../public', file);

    // VULNERABILITY: No path sanitization (e.g., "../package.json")
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: "File not found or access denied" });
        }
        res.send(data);
    });
});

// VULNERABILITY: Unrestricted File Upload
// No validation on file type, size, or content
router.post('/upload', verifyToken, upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
        message: "File uploaded successfully",
        filename: req.file.originalname,
        path: `/uploads/${req.file.originalname}`
    });
});

module.exports = router;
