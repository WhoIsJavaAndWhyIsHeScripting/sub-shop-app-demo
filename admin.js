/* Routes for the admin pages. */

// for node instance creation
const express = require("express");

const router = express.Router();

// for password hashing
const bcrypt = require("bcrypt");

// for file reading
const fs = require("fs");

// for file paths
const path = require("path");


// client side javascript for the users page
router.get("/admin-users-script", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "layout",
            "admin-page",
            "admin-users",
            "admin-users-script.js",
        ),
    );
});

// route for log in page
router.get("/log-in", (req, res) => {
    res.sendFile(
        path.join(__dirname, "layout", "admin-page", "log-in", "log-in.html"),
    );
});

// Generated manually from the actual password with bcrypt and a salt level of 12.
// This way, the password is not directly and obviously hardcoded.
const ADMIN_PASSWORD_HASH =
    "$2b$12$8sWl21k7ybLE0SnpfmzaMukK5IN99EjuBE/kUdRxaxWXTfibNKGrW";

// Check if the password entered was correct and log in user if so
router.post("/check-password", (req, res) => {
    // Compare password with the hash
    bcrypt.compare(req.body.password, "1234", (err, result) => {
        if (err) console.log(err);
        if (result) {
            req.session.user = { username: "admin" };
            // console.log("Successful admin login.");
        } else {
            req.session.user = { username: "" };
            // console.log("Unsuccessful admin login.");
        }
        res.redirect("/admin/home");
    });
});


/**
 * Function for serving pages with admin verification
 * 
 * This assumes the source file is at ./layout/admin/{filePath}/{filePath}.html.
 * 
 * @param {string} filePath the path in the client side URL
 * @param {string} file the name of the source on the server
 */
function loadAdminPage(filePath, file) {
    router.get("/" + filePath, (req, res) => {
        if (req.session.user != undefined) {
            if (req.session.user.username == "admin") {
                res.sendFile(
                    path.join(__dirname, "layout", "admin-page", file, file + ".html"),
                );
            } else {
                res.redirect("/admin/log-in");
            }
        } else {
            res.redirect("/admin/log-in");
        }
    });
}

/**
 * Similar to loadAdminPage, but it does not add any prefixes or suffixes. 
 * 
 * @param {string} filePath the path in the client side URL
 * @param {string} file the path to the source file on the server
 */
function loadAdminResource(filePath, file) {
    router.get("/" + filePath, (req, res) => {
        if (req.session.user != undefined) {
            if (req.session.user.username == "admin") {
                res.sendFile(path.join(__dirname, file));
            } else {
                res.redirect("admin/log-in");
            }
        } else {
            res.redirect("admin/log-in");
        }
    });
}

// route for admin home
loadAdminPage("home", "admin-home");

// route for ingredients page
loadAdminPage("ingredients", "admin-ingredients");

// route for users page
loadAdminPage("users", "admin-users");

// non-html files for the admin pages
loadAdminResource("ban-list.txt", "data/admin/ban-list.txt");
loadAdminResource("out-of-stock.txt", "data/admin/out-of-stock.txt");
loadAdminResource(
    "admin-home-styles.css",
    "layout/admin-page/admin-home/admin-home-styles.css",
);
loadAdminResource(
    "admin-ingredients-styles.css",
    "layout/admin-page/admin-ingredients/admin-ingredients-styles.css",
);
loadAdminResource(
    "admin-users-styles.css",
    "layout/admin-page/admin-users/admin-users-styles.css",
);


// Routes for form submissions

// handle post request when ingredients form submitted
router.post("/submit-ingredients", (req, res) => {
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
    fs.writeFile(
        path.join(__dirname, "data", "admin", "out-of-stock.txt"),
        ingredientsText,
        (err) => {
            if (err) {
                console.log(err);
            }
            // console.log("yippee");
        },
    );

    // go back to ingredients page
    res.redirect("/admin/ingredients");
});

// handle post request when users form submitted
router.post("/submit-users", (req, res) => {
    // handle when a user is ADDED to the list
    var bannedUser = req.body.banned;
    // append the data to the file with a comma before if it's not empty
    if (bannedUser != null) {
        if (
            fs.statSync(
                path.join(__dirname, "data", "admin", "ban-list.txt")
            ).size != 0
        ) {
            fs.appendFile(
                path.join(__dirname, "data", "admin", "ban-list.txt"),
                "," + bannedUser,
                (err) => {
                    if (err) {
                        throw err;
                    }
                },
            );
        } else {
            // otherwise just append the data
            fs.appendFile(
                path.join(__dirname, "data", "admin", "ban-list.txt"),
                bannedUser,
                (err) => {
                    if (err) {
                        throw err;
                    }
                },
            );
        }
    }

    // handle when a user should be REMOVED from the list
    var toBeRemoved = req.body.hidden;

    if (toBeRemoved != null) {
        // read the banned users list and split by commas
        fs.readFile(
            path.join(__dirname, "data", "admin", "ban-list.txt"),
            (err, data) => {
                var commaSplit = data.toString().split(",");
                // check which user name matches the user to be removed
                // and remove it from the list
                for (let i = 0; i < commaSplit.length; i++) {
                    if (commaSplit[i] == req.body.hidden) {
                        commaSplit.splice(i, 1);
                    }
                }
                // recreate the file with the user removed based on length
                if (commaSplit.length == 0) {
                    // if there's no users left, just make the file empty
                    fs.writeFileSync(
                        path.join(__dirname, "data", "admin", "ban-list.txt"),
                        "",
                    );
                } else if (commaSplit.length == 1) {
                    // if there's one user left, just write their name
                    fs.writeFileSync(
                        path.join(__dirname, "data", "admin", "ban-list.txt"),
                        commaSplit[0],
                    );
                } else if (commaSplit.length > 1) {
                    // if there's 2+ users left, write the first user then append all the other users with commas before
                    fs.writeFileSync(
                        path.join(__dirname, "data", "admin", "ban-list.txt"),
                        commaSplit[0],
                    );
                    // do not add empty names
                    for (let i = 1; i < commaSplit.length; i++) {
                        if (commaSplit[i] != "" && commaSplit[i] != undefined) {
                            fs.appendFileSync(
                                path.join(__dirname, "data", "admin", "ban-list.txt"),
                                "," + commaSplit[i],
                            );
                        }
                    }
                }
            },
        );
    }
    // redirect back to the users page
    res.redirect("/admin/users");
});

module.exports = { admin_router: router };
