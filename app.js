const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const http = require('http');
const credentials = {
  key: fs.readFileSync('privkey.pem', 'utf-8'), 
  cert: fs.readFileSync('fullchain.pem', 'utf-8'),
};

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
  res.sendFile(path.join(__dirname, 'layout', 'credits-page.html'));
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
// route for order-scripts.js
app.get('/order-scripts-js', (req, res) => {
  res.sendFile(path.join(__dirname, 'layout', 'order-scripts.js'));
});
// route for functions.js
app.get('/functions-js', (req, res) => {
  res.sendFile(path.join(__dirname, 'functions.js'));
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
// populate the sub order csv with the form data
// populate the sub order csv with the form data
app.post('/order-submit', (req, res) => {
  let time = new Date();
  let dateAndTime = time.toLocaleString("en-US");
  let lunchPeriod = req.body.period;
  let inch = req.body.inch;
  let bread = req.body.bread;
  let toasted = req.body.toasted;
  let protein = req.body.protein;
  let toppings = req.body.veggies;
  let sauces = req.body.condiments;
  const email = req.body.email;
  let base = "";
  let arrayize = [lunchPeriod, base, protein, toppings, sauces, email];
  // clean up data
  for (let i = 2; i < arrayize.length-1; i++) {
    if ("" + arrayize[i] == "undefined") {
      arrayize[i] = "None";
    } else {
      // add spaces between items
      let spacedEntry = "";
      console.log(arrayize[i][0]);
      // check if element is an actual array in a lazy way so strings aren't separated by character
      if (arrayize[i][0].length > 1) {
        console.log("hello :3");
        spacedEntry += arrayize[i][0];
        for (let j = 1; j < arrayize[i].length; j++) {
          spacedEntry += `, ${arrayize[i][j]}`;
        }
        arrayize[i] = spacedEntry;
      }
      console.log(arrayize);
    }

  }
  // conglomerate length, base type and toasted into one "base" cell
  console.log(inch, toasted, bread);
  console.log(toasted == "Toasted");
  if ("" + inch != "undefined") {
    console.log("1");
    base += inch + " Inch ";
  } 
  if (toasted == "Toasted") {
    console.log("2");
    base += "Toasted ";
  }
  base += bread;
  arrayize[1] = base;
  fs.appendFile(path.join(__dirname, "layout", "sub-orders.csv"), `\n${dateAndTime};${arrayize[0]};${arrayize[1]};${arrayize[2]};${arrayize[3]};${arrayize[4]};${arrayize[5]}`, () => {
    res.redirect('/');
  });

});
// 404 error handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'layout', '404.html'));
});
// check if a value is undefined, then remove it
// Start the server
http.createServer(credentials, app).listen(3000, "localhost", () => {
    console.log('Server listening on port 3000');
});
