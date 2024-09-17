const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors
const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'data')));

// Middleware to parse JSON
app.use(express.json());

app.get('/data/output.csv', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'output.csv'));
});

app.get('/data/output.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'output.json'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});