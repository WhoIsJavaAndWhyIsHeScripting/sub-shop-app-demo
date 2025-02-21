const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-home')));
app.use(express.static(path.join(__dirname, 'layout', 'styles')));
// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-home', 'admin-home.html'));
});

app.get('/ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients', 'admin-ingredients.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});