# SubShopApp  

Welcome to the SubShopApp project!

<img src="./assets/bearbiteslogo.png" alt="Sub Shop logo" height="100">

This repository and Gitlab project contains the code for a web application for ordering sub sandwiches from the Bear Bites shop at UAHS. This code is run on a school server.

See [OMITTED] for the live webpage.  

## Overview

This application is mostly written in Node.js, a Javascript runtime. This handles GET (request for a webpage, usually) and POST (incoming orders, usually) requests to the server.

Google authentication is used to verify and restrict orders.

The Python scripts that email the orders are configured to run on the server.

For now, our data (orders as well as admin settings) is stored in plain text in a csv format for the sake of simplicity. This will likely change later on.

## File Structure

- layout - the folder for all our frontend stuff. This includes HTML, CSS and frontend JS files. Our 3 main pages visible to users are in the top level folder. The file sub-orders.csv contains the actual orders (the copy on Gitlab should only have the headers).
  - admin-page - the folder for the three admin pages.
  - styles - this is where we put any CSS that isn't specific to one page.
- data - this is were live data like the actual sub orders are saved -- the files in the repository will be empty or only have a header
- assets - this is where we keep our images.  
- python-scripts - this is where all our python is contained, which handles turning the CSV order data into a PDF and emailing it.  
- app.js - this is where our server is. This is where routing and some form validation are handled.
- admin.js - contains routes for the admin page
- functions.js - contains functions for Google authentication  

[contributions and contact info omitted]
