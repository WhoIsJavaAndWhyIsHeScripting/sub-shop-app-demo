const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

app.engine('html', require('ejs').renderFile);

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
// create request body thing i don't really know how this works
app.use(express.urlencoded({extended: true}))
// handle post request when ingredients form submitted
app.post('/submit', (req, res) => {
  // get the values of the checked checkboxes
 let ingredients = req.body.ingredients;
 // turn it into a comma separated list
 let ingredientsText = "";
 ingredientsText += ingredients[0];
 for (let i = 1; i < ingredients.length; i++) {
  ingredientsText += "," + ingredients[i];
 }
 // replace whatever is in out-of-stock.txt with the new comma separated list
 fs.writeFile(path.join(__dirname, "layout", "admin-page", "admin-ingredients", "out-of-stock.txt"), ingredientsText, (err) => {
  if (err) {
    throw err;
  }
  console.log("yippee");
 })
 // go back to ingredients page
 res.redirect("/ingredients");
})
// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});