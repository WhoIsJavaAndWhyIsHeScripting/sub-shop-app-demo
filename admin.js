/* Routes for the admin pages. */

// for node instance creation
const express = require('express');

const router = express.Router();

// for file reading
const fs = require('fs');

// for file paths
const path = require('path');

router.get('/admin-users-script', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'admin-users', 'admin-users-script.js'));
});

// route for log in page
router.get('/log-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'admin-page', 'log-in', 'log-in.html'));
});

// check if the password entered was correct and log in user if so
router.post('/check-password', (req, res) => {
    if (req.body.password == "PASSWORD_REMOVED") {
        req.session.user = { username: "admin" };
    }
    res.redirect('/admin/home');
})

// function for pages with admin verification
// path - the path name
// file - the folder name
function loadAdminPage(filePath, file) {
    router.get('/' + filePath, (req, res) => {
        if (req.session.user != undefined) {
            if (req.session.user.username == "admin") {
                res.sendFile(path.join(__dirname, 'layout', 'admin-page', file, file + ".html"));
            } else {
                res.redirect('/admin/log-in');
            }
        } else {
            res.redirect('/admin/log-in');
        }
    })
}

// Similar to load admin page, but it does not add any prefixes or suffixes
function loadAdminResource(filePath, file) {
    router.get('/' + filePath, (req, res) => {
        if (req.session.user != undefined) {
            if (req.session.user.username == "admin") {
                res.sendFile(path.join(__dirname, file));
            } else {
                res.redirect('admin/log-in');
            }
        } else {
            res.redirect('admin/log-in');
        }
    })
}

// Route for admin home
loadAdminPage('home', 'admin-home');

// route for ingredients page
loadAdminPage('ingredients', 'admin-ingredients');

// route for users page
loadAdminPage('users', 'admin-users');

// non-html files for the admin pages
loadAdminResource('ban-list.txt', "data/admin/ban-list.txt");
loadAdminResource('out-of-stock.txt', "data/admin/out-of-stock.txt");
loadAdminResource('admin-home-styles.css', "layout/admin-page/admin-home/admin-home-styles.css");
loadAdminResource('admin-ingredients-styles.css', "layout/admin-page/admin-ingredients/admin-ingredients-styles.css");
loadAdminResource('admin-users-styles.css', "layout/admin-page/admin-users/admin-users-styles.css");

module.exports = { admin_router: router };
