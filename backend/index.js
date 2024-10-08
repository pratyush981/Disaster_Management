const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000; 

app.use(cors());
app.use(express.json());

// Serve static files from the 'data' directory
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/data/output.csv', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'output.csv'));
});

app.get('/data/output.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'output.json'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
