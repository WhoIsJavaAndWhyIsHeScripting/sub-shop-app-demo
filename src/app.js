const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

app.engine('html', require('ejs').renderFile);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-home')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-users')));
app.use(express.static(path.join(__dirname, 'layout', 'styles')));
// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-home', 'admin-home.html'));
});

app.get('/ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients', 'admin-ingredients.html'));
});

app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-users', 'admin-users.html'));
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

app.post('/submit2', (req, res) => {
  var bannedUser = req.body.banned;
  var epicdata;
  // append the data to the file with a comma before if it's not empty
  if (bannedUser != null) {
  if (fs.statSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt")).size != 0) {
      fs.appendFile(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), "," + bannedUser, (err) => {
        if (err) {
          throw err;
        }
      })
  } else {
    fs.appendFile(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), bannedUser, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
  var toBeRemoved = req.body.hidden;
  console.log(toBeRemoved);
  if (toBeRemoved != null) {
    fs.readFile(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), (err, data) => {
      var commaSplit = data.toString().split(",");

      for (guy in commaSplit) {
        if (commaSplit[guy] == req.body.hidden) {
          commaSplit.splice(guy, 1);
          console.log("1 " + commaSplit);
        }
      }
      console.log("frick " + commaSplit.length);
      if (commaSplit.length == 0) {
        fs.writeFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), "");
      } else if (commaSplit.length == 1) {
      fs.writeFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"),commaSplit[0]);
      } else if (commaSplit.length > 1) {
        fs.writeFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"),commaSplit[0]);
        for (let i = 1; i < commaSplit.length; i++) {
          if (commaSplit[i] != "" && commaSplit[i] != undefined) {
            fs.appendFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), "," + commaSplit[i]);
        }
      }
    }
    });
  }
  res.redirect('/users');
});
// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});