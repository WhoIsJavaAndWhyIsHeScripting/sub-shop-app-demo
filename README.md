# SubShopApp  

Welcome to the SubShopApp project! 

<img src="./assets/bearbiteslogo.png" height="100"> 

This repository and Gitlab project contains the code for a web application for ordering sub sandwiches from the Bear Bites shop at UAHS. This code is run on a school server. 

## Overview 

This application is mostly written in Node.js, a Javascript runtime. This handles GET (request for a webpage, usually) and POST (incoming orders, usually) requests to the server. 

For now, our data (orders as well as admin settings) is stored in plain text in a csv format for the sake of simplicity. This will likely change later on.

## File Structure 

- layout - the folder for all of our frontend stuff. This includes HTML, CSS and frontend JS files. Our 3 main pages visible to users are in the top level folder. The file sub-orders.csv contains the actual orders (the copy on Gitlab should only have the headers).
  - admin-page - the folder for the three admin pages.
  - styles - this is where we put any CSS that isn't specific to one page.
- assets - this is where we keep our images.  
- python-scripts - this is where all our python is contained, which handles turning the CSV order data into a PDF and emailing it.  
- app.js - this is where our server is. This is where routing and some form validation are handled.  

## Resources 

- [https://developer.mozilla.org/en-US/](https://developer.mozilla.org/en-US/) fantastic tutorials for javascript, node.js, and basically anything frontend related.
- [https://ww.w3schools.com/](https://www.w3schools.com/) good tutorials for HTML, CSS and Javascript.
Stack Overflow - Great website if you're stuck. If you have a bug, someone else here has probably already had the same problem and knows how to fix it.
Google - this will literally be your most useful resource as a developer. Paste your error messages in here. Search up dumb questions about your language of choice. Try to find a function that does something specific. Literally almost ANY question you have can be answered online. IT'S NOT CHEATING. USE IT.  
- [https://docs.python.org/](https://docs.python.org/) Probably not the best place to learn Python, but if you need to reference a function or module's documentations, this is the place to go  (for the package that makes the PDFs, see [https://docs.reportlab.com/reportlab/userguide/ch1_intro/](https://docs.reportlab.com/reportlab/userguide/ch1_intro/)).

## Contributing 

1. First, you will need access to this Gitlab project (which, if you are reading this, you probably already have). 
2. Install Git if you do not have it already. 
3. Download a IDE that has Git support (Visual Studio Code is good choice). 
4. In Gitlab, go to "Edit Profile" and then "Access Tokens." Make a new token with all priviliges/scopes. 
5. *Copy and save the token it gives you somewhere safe!* 
6. Open a new folder on your computer and clone the git repository with the url "https://oauth2:XXXXXXXXXX@gitlab-student.uaschools.org/compsci-club/subshopapp.git" where XXXXXXXXXX is the token it gave you. 
7. Congrats! You are ready to start making contributions. (Please do not commit directy to the main branch, however.) 
8. Note: To work on the Node.js or HTML code, you should install Node.js and the express library. 
9. Note: to work on the Python scripts, you should install Python and the packages in requirements.txt. 

## Contact 

EMAIL REMOVED - Charlie, project manager.  
If you have questions/need help with anything, you can contact me. I contributed a lot to the frontend stuff (helped with pretty
much everything in the layout folder) and the routing and form
handling in app.js. I probably won't be able to help with https
or anything in python-scripts. 

EMAIL REMOVED - Evan, worked with the backend.  
Contact me as backup. I contributed to the Python scripts as well some client-side Javascript. I can't help much with Node or the most of the front end. 
