const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const https = require('https');
const privateKey = fs.readFileSync(path.resolve(__dirname, './privkey.pem'), 'utf-8');
const certificate = fs.readFileSync(path.resolve(__dirname, './fullchain.pem'), 'utf-8');

const credentials = {key: privateKey, cert: certificate};

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-home')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-users')));
app.use(express.static(__dirname));
// route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'subShopFront.html'));
})
// route for order page
app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'subShopOrder.html'));
})
// route for credits page
app.get('/credits', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'Credits.html'));
})
// Route for admin home
app.get('/admin-home', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-home', 'admin-home.html'));
});
// route for ingredients page
app.get('/ingredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients', 'admin-ingredients.html'));
});
// route for users page
app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-users', 'admin-users.html'));
});
// create route for css boilerplate
app.get('/boilerplate', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'styles', 'boilerplate.css'));
});
// create route for css boilerplate for main pages
app.get('/main-pages-css', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'styles', 'main-pages.css'));
});
// create route for out of stock file
app.get('/out-of-stock', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients', 'out-of-stock.txt'));
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
// handle post request when users form submitted
app.post('/submit2', (req, res) => {
  // handle when a user is ADDED to the list
  var bannedUser = req.body.banned;
  // append the data to the file with a comma before if it's not empty
  if (bannedUser != null) {
  if (fs.statSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt")).size != 0) {
      fs.appendFile(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), "," + bannedUser, (err) => {
        if (err) {
          throw err;
        }
      })
  } else {
    // otherwise just append the data
    fs.appendFile(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), bannedUser, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
// handle when a user should be REMOVED from the list
  var toBeRemoved = req.body.hidden;
  
  if (toBeRemoved != null) {
    // read the banned users list and split by commas
    fs.readFile(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), (err, data) => {
      var commaSplit = data.toString().split(",");
      // check which user name matches the user to be removed
      // and remove it from the list
      for (guy in commaSplit) {
        if (commaSplit[guy] == req.body.hidden) {
          commaSplit.splice(guy, 1);
        }
      }
      // recreate the file with the user removed based on length
      if (commaSplit.length == 0) {
        // if there's no users left, just make the file empty
        fs.writeFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), "");
      } else if (commaSplit.length == 1) {
        // if there's one user left, just write their name
      fs.writeFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"),commaSplit[0]);
      } else if (commaSplit.length > 1) {
        // if there's 2+ users left, write the first user then append all the other users with commas before
        fs.writeFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"),commaSplit[0]);
        // do not add empty names
        for (let i = 1; i < commaSplit.length; i++) {
          if (commaSplit[i] != "" && commaSplit[i] != undefined) {
            fs.appendFileSync(path.join(__dirname, "layout", "admin-page", "admin-users", "ban-list.txt"), "," + commaSplit[i]);
        }
      }
    }
    });
  }
  // redirect back to the users page
  res.redirect('/users');
});

app.post('/order-submit', (req, res) => {
  var time = new Date();
  var dateAndTime = time.toLocaleString("en-US");
  var inch = req.body.inch;
  var bread = req.body.bread;
  var protein = req.body.protein;
  var toppings = req.body.veggies;
  var sauces = req.body.condiments;
  fs.appendFile(path.join(__dirname, "layout", "sub-orders.csv"), `\n${dateAndTime},${inch},${bread},${protein},${toppings},${sauces}`, () => {
    res.redirect('/');
  })
})
// Start the server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000, "localhost", () => {
    console.log('Server listening on port 3000');
});