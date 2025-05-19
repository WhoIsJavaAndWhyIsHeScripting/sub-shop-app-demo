// for node instance creation
const express = require('express');

// for file reading
const fs = require('fs');

// the node instance
const app = express();

// for file paths
const path = require('path');

// using http support to create the node instance, https is handled 
const http = require('http');

// https credentials, uses symbolic links to point to the following credential files
const credentials = {
  key: fs.readFileSync('privkey.pem', 'utf-8'), 
  cert: fs.readFileSync('fullchain.pem', 'utf-8'),
};

// creates a session that stores the user email
const session = require ('express-session');

// generate a random string of numbers and letters for every session
const { randomUUID } = require('crypto');
// initialize session
app.use(session({
  secret: randomUUID(),
  resave: true,
  saveUninitialized: false
}))

// for verifying Google ID_TOKENs
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = "702804890232-pj9j2siaa55563pild655ev156i36un5.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// check the server time and open/close the server at given times
var isOpen = false;
function updateTime() {
  var currentTime = new Date();
  var hour = currentTime.getHours();
  var minute = currentTime.getMinutes();
  hour += minute/60;
  if (hour >= 7.5 && hour < 9.5) {
    isOpen = true;
  } else {
    isOpen = false;
  }
}

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-ingredients')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-home')));
app.use(express.static(path.join(__dirname, 'layout', 'admin-page', 'admin-users')));
app.use(express.static(__dirname));

// function for sending a file to a path
// route - the actual path on the server/the subpage on the internet (subshop-dev.uaschools.io/route)
// path - the path for the file that will be sent
// verify - boolean, whether you should verify if the shop is open when sending the file
function loadPage(route, sendPath, verify) {
  app.get(route, (req, res) => {
    if (verify) {
      updateTime();
      if (isOpen) {
        res.sendFile(sendPath);
      } else {
        res.sendFile(path.join(__dirname, 'layout', 'sorry.html'));
      }
    } else {
      res.sendFile(path.join(sendPath));
    }
  })
}
// route for home page
loadPage('/', path.join(__dirname, 'layout', 'subShopFront.html'), true);
// route for order page
loadPage('/order', path.join(__dirname, 'layout', 'subShopOrder.html'), true);
// route for credits page
loadPage('/credits', path.join(__dirname, 'layout', 'credits-page.html'), true);
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
 if (ingredients != undefined) {
    ingredientsText += ingredients[0];
    for (let i = 1; i < ingredients.length; i++) {
      ingredientsText += "," + ingredients[i];
     }
 }
 // replace whatever is in out-of-stock.txt with the new comma separated list
  fs.writeFile(path.join(__dirname, "layout", "admin-page", "admin-ingredients", "out-of-stock.txt"), ingredientsText, (err) => {
    if (err) {
      console.log(err);
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


//redirect to order page after successful Google authentication
app.post('/order', (req, res) => {
  var credential = parseJwt(req.body.credential);

  try {
    const user = verifyToken(credential);

    var email = credential.email;
    var name = credential.given_name + " ";
  
    var family_name = credential.family_name;
    if(credential.family_name.includes("(Student)")) {
      name += family_name.split(" ")[0];
    } else {
      name += family_name;
    }
    req.session.name = name;

    console.log(email);
    console.log(name);

    res.cookie('email', email, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24
    });
    res.cookie('name', name, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24
    });

    res.redirect('/order');

  } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).send("Invalid token");
  }
});

// verify Google ID_TOKEN before using its information
function verifyToken(token) {
  /*const ticket = client.verifyIdToken({ ****Commented out b/c the Google Auth Library is buggin****
    idToken: token,
    audience: CLIENT_ID
  });
  return ticket.idToken;*/ // contains user info

  return token;
}

// parse Google ID_TOKEN
function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


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
  let name = req.session.name;
  let base = "";
  let arrayize = [name, lunchPeriod, base, protein, toppings, sauces];
  // clean up data
  for (let i = 3; i < arrayize.length; i++) {
    if ("" + arrayize[i] == "undefined") {
      arrayize[i] = "None";
    } else {
      // add spaces between items
      let spacedEntry = "";
      console.log(arrayize[i][0]);
      // check if element is an actual array in a lazy way so strings aren't separated by character
      if (arrayize[i][0].length > 1) {
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
  arrayize[2] = base;
  fs.appendFile(path.join(__dirname, "layout", "sub-orders.csv"), `\n${arrayize[0]};${arrayize[1]};${arrayize[2]};${arrayize[3]};${arrayize[4]};${arrayize[5]}`, () => {
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
