/* Main server file */

// for node instance creation
const express = require("express");

// the node instance
const app = express();
// use express middleware for parsing url POST requests
app.use(express.urlencoded({ extended: true }));

// for file reading
const fs = require("fs");

// for file paths
const path = require("path");

// using http support to create the node instance, https is handled
const http = require("http");

// https credentials, uses symbolic links to point to the following credential files
const credentials = {
  key: fs.readFileSync("privkey.pem", "utf-8"),
  cert: fs.readFileSync("fullchain.pem", "utf-8"),
};

// creates a session that stores the user email
const session = require("cookie-session");

// generate a random string of numbers and letters for every session
const { randomUUID } = require("crypto");

// import router from admin.js
let { admin_router } = require("./admin");

// initialize session
app.use(
  session({
    name: "session",
    secret: randomUUID(),
    maxAge: 24 * 60 * 60 * 1000, // session expires after 24 hrs
  }),
);

// for verifying Google ID_TOKENs
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "702804890232-pj9j2siaa55563pild655ev156i36un5.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// this variable controls whether you can access the order page
var isOpen = false;
// this variable represents whether the nutrition staff have chosen to open or close the sub shop
var openToday = true;
// the number of orders currently placed
var lines = 0;
// order limit for the day
var orderLimit = 10;

// when order page becomes available (in hours after midnight)
const OPEN_TIME = 7.5;
// when order page closes (in hours after midnight)
const CLOSE_TIME = 9;

// check the server time and open/close the server at given times
function updateOpenStatus() {
  var currentTime = new Date();
  var hour = currentTime.getHours();
  var minute = currentTime.getMinutes();
  hour += minute / 60;
  // count the number of lines sub-orders.csv has
  var data = fs.readFileSync(path.join(__dirname, "data", "sub-orders.csv"));
  var newLineMatch = data.toString().match(/\n/g);
  if (newLineMatch != null) {
    lines = newLineMatch.length;
  } else {
    lines = 0;
  }
  isOpen = (
    hour >= OPEN_TIME &&
    hour < CLOSE_TIME &&
    lines < orderLimit &&
    openToday
  );
}

// This is for formatting the opening and closing times for getClosedReason().
const formatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
function getTimeString(hours) {
  return formatter.format(new Date(1970, 0, 1, 0, hours * 60, 0));
}

// gets the reason the sub shop is closed
// returns a string of the reason the shop is closed
function getClosedReason() {
  var time = new Date();
  var formattedTime = time.getHours() + time.getMinutes() / 60;
  if (formattedTime < OPEN_TIME || formattedTime > CLOSE_TIME) {
    return `You are attempting to order outside the time window (${getTimeString(OPEN_TIME)} - ${getTimeString(CLOSE_TIME)}). Come back tomorrow!`;
  } else if (!openToday) {
    return "The staff have chosen to close the sub shop for the day (this is usually due to staffing issues). Try again tomorrow!";
  } else if (lines >= orderLimit) {
    return "The order limit has been reached for the day. Try coming back earlier tomorrow!";
  } else {
    return "Unknown reason. This may be due to an error. If you are seeing this message, you can fill out the feedback form on the contacts page to report the issue.";
  }
}

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "assets")));
// if adding more paths here, never let __dirname be served directly!

// Serve admin pages
app.use("/admin", admin_router);

// redirect to login for backward compatability
app.get("/admin-home", (req, res) => {
  res.redirect("/admin/log-in");
});

// The following three routes work with global variables and therefore are here
//  instead of in admin.js.

// handle post request when open/close switch toggled
app.post("/open-close", (req, res) => {
  openToday = !openToday;
  res.redirect("/admin/users");
});

// get open status
app.get("/open-close", (req, res) => {
  res.json({ open: openToday.toString() });
});

// change the order limit from the users page
app.post("/change-order-limit", (req, res) => {
  orderLimit = req.body.limit;
  console.log("New order limit: " + orderLimit);
  res.redirect("/admin/users");
});

/**
 * Function for sending a file to a path. If verify is true and the website is
 * closed, layout/sorry.html is sent.
 *
 * @param route the actual path on the server/the subpage on the internet (subshop-dev.uaschools.io/route)
 * @param path the path for the file that will be sent
 * @param verify boolean, whether you should verify if the shop is open when sending the file
 */
function loadPage(route, sendPath, verify) {
  app.get(route, (req, res) => {
    if (verify) {
      updateOpenStatus();
      if (isOpen) {
        res.sendFile(sendPath);
      } else {
        res.sendFile(path.join(__dirname, "layout", "sorry.html"));
      }
    } else {
      res.sendFile(path.join(sendPath));
    }
  });
}

app.get("/closed-reason", (req, res) => {
  let reason = getClosedReason();
  res.json({ closedReason: reason });
});

app.get("/order-limit", (req, res) => {
  res.json({ limit: orderLimit });
});

// route for home page
loadPage("/", path.join(__dirname, "layout", "subShopFront.html"), false);

// create route for css boilerplate
app.get("/boilerplate", (req, res) => {
  res.sendFile(path.join(__dirname, "layout", "styles", "boilerplate.css"));
});

// create route for css boilerplate for main pages
app.get("/main-pages-css", (req, res) => {
  res.sendFile(path.join(__dirname, "layout", "styles", "main-pages.css"));
});

// route for functions.js
app.get("/functions-js", (req, res) => {
  res.sendFile(path.join(__dirname, "functions.js"));
});

// route for order-scripts.js
app.get("/order-scripts-js", (req, res) => {
  res.sendFile(path.join(__dirname, "layout", "order-scripts.js"));
});

// create route for out of stock file
app.get("/out-of-stock", (req, res) => {
  res.sendFile(path.join(__dirname, "data", "admin", "out-of-stock.txt"));
});

// route for order page
app.get("/order", (req, res) => {
  updateOpenStatus();
  if (isOpen) {
    res.sendFile(path.join(__dirname, "layout", "subShopOrder.html"));
  } else {
    res.sendFile(path.join(__dirname, "layout", "sorry.html"));
  }
});

// route for credits page
loadPage(
  "/credits",
  path.join(__dirname, "layout", "credits-page.html"),
  false,
);

// route for contact page
loadPage(
  "/contact-us",
  path.join(__dirname, "layout", "contact-us.html"),
  false,
);

// redirect to order page after successful Google authentication
app.post("/order", (req, res) => {
  var credential = parseJwt(req.body.credential);

  try {
    const user = verifyToken(credential);

    var email = credential.email;
    var name = credential.given_name + " ";

    var family_name = credential.family_name;
    if (credential.family_name.includes("(Student)")) {
      name += family_name.split(" ")[0];
    } else {
      name += family_name;
    }
    req.session.name = name;

    console.log("Order recieved from " + email);

    res.cookie("email", email, {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("name", name, {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.redirect("/order?loggedIn=true");
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
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

// populate the sub order csv with the form data
app.post("/order-submit", (req, res) => {
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

  if ("" + toasted == "undefined") {
    toasted = "N/A";
  }

  let arrayize = [name, lunchPeriod, base, toasted, protein, toppings, sauces];
  // clean up data
  for (let i = 3; i < arrayize.length; i++) {
    if ("" + arrayize[i] == "undefined") {
      arrayize[i] = "None";
    } else {
      // add spaces between items
      let spacedEntry = "";
      // check if element is an actual array in a lazy way so strings aren't separated by character
      if (arrayize[i][0].length > 1) {
        spacedEntry += arrayize[i][0];
        for (let j = 1; j < arrayize[i].length; j++) {
          spacedEntry += `, ${arrayize[i][j]}`;
        }
        arrayize[i] = spacedEntry;
      }
    }
  }
  // conglomerate length, base type and toasted into one "base" cell
  if ("" + inch != "undefined") {
    base += inch + " Inch ";
  }
  base += bread;
  arrayize[2] = base;
  if ("" + name != "undefined") {
    fs.appendFile(
      path.join(__dirname, "data", "sub-orders.csv"),
      `\n${arrayize[0]};${arrayize[1]};${arrayize[2]};${arrayize[3]};${arrayize[4]};${arrayize[5]};${arrayize[6]}`,
      () => {
        res.redirect("/");
      },
    );
  } else {
    res.send(
      "ERROR: Order denied. "
      + "You attempted to send an order without an order name. "
      + "Please try again.\n\nIf you believe this is an error, submit a bug report (linked on the contacts page). "
      + "If you're trying to hack us... go away >:(",
    );
  }
});

// check if the user is banned or has already ordered
app.get("/check-user", async (req, res) => {
  let username = req.session.name;
  try {
    let banned_data = await fs.promises.readFile(
      path.join(__dirname, "data", "admin", "ban-list.txt"),
    );
    let banned = banned_data.toString().split(",");
    let is_banned = false;
    for (const guy of banned) {
      if (guy.trim() == username) {
        is_banned = true;
      }
    }

    let order_data = await fs.promises.readFile(
      path.join(__dirname, "data", "sub-orders.csv"),
    );
    let orders = order_data.toString().split("\n");
    let has_ordered = false;
    for (const item of orders) {
      if (item.split(";")[0].trim() == username) {
        has_ordered = true;
        break;
      }
    }

    res.json({
      has_ordered: has_ordered,
      is_banned: is_banned,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 404 error handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "layout", "404.html"));
});

// Start the server
http.createServer(credentials, app).listen(3000, "localhost", () => {
  console.log("Server listening on port 3000");
});
