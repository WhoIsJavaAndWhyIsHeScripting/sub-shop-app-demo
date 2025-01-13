<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>Manage Ingredients</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="admin-ingredients-styles.css" rel="stylesheet">
        <!--add in Montserrat font, font used on the uaschools website-->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    </head>
<?php 
//opens the out of stock list to read
$file = fopen("out-of-stock.csv", "r");
// reads out-of-stock.csv if it is not empty
if (filesize("out-of-stock.csv") > 0) {
    $filetext = fread($file, filesize("out-of-stock.csv") - 1);
} else {
    $filetext = "";
}
// split the text read into an array
$explodedtext = explode(",", $filetext);
/* check if the ingredient is in the out of stock list and check or uncheck it, 
returns an HTML checkbox with the first parameter as the id and value and
the second as the label name. The third parameter is just the text from the file */
function loadData($ingr, $label, &$explodedtext) {
    foreach($explodedtext as $txt) {
        if ($ingr == $txt) {
            return "<label for=\"$ingr\"><input checked type='checkbox' id=\"$ingr\" value=\"$ingr\" name='ingredient[]'>$label</label>";
        }
    }
    return "<label for=\"$ingr\"><input type='checkbox' id=\"$ingr\" value=\"$ingr\" name='ingredient[]'>$label</label>";
}
?>

    <body>
        <header>
            <div class="headerbar"><img src="/src/assets/bearbiteslogo.png"><a href="admin-home.html">Bear Bites</a></div>
        </header>
        <main>
            <h1>Manage Ingredients</h1>
            <p>
                Check a box to mark an ingredent as out of stock. 
                Uncheck a box to mark an ingredient as in stock. 
                Click "Save" when you are done to save your changes 
                to the website.
            </p>
            <form action="admin-form-handling.php" method="POST">
                <fieldset>
                    <legend>Bread</legend>
                    <?php 
                        echo loadData("white-bread", "White Bread", $explodedtext);
                        echo loadData("wheat-bread", "Wheat Bread", $explodedtext);
                    ?>
                </fieldset>
                <fieldset>
                    <legend>Protein</legend>
                    <?php
                    echo loadData("turkey", "Roasted Turkey", $explodedtext);
                    echo loadData("bacon", "Bacon", $explodedtext);
                    echo loadData("ham", "Honey Ham", $explodedtext);
                    echo loadData("salami", "Salami", $explodedtext);
                    echo loadData("pepperoni", "Pepperoni", $explodedtext);
                    echo loadData("american", "American Cheese", $explodedtext);
                    echo loadData("swiss", "Swiss Cheese", $explodedtext);
                    echo loadData("cheddar", "Cheddar Cheese", $explodedtext);
                    echo loadData("hot-pepper", "Hot Pepper Cheese", $explodedtext);
                    echo loadData("provolone", "Provolone Cheese", $explodedtext);
                    echo loadData("shredded-cheddar", "Shredded Cheddar", $explodedtext);
                    ?>
                </fieldset>
                <fieldset>
                    <legend>Toppings</legend>
                    <?php
                    echo loadData("onions","Onions",$explodedtext);
                    echo loadData("cucumbers","Cucumbers",$explodedtext);
                    echo loadData("tomatoes","Tomatoes",$explodedtext);
                    echo loadData("olives","Olives",$explodedtext);
                    echo loadData("spinach","Spinach",$explodedtext);
                    echo loadData("lettuce","Lettuce",$explodedtext);
                    echo loadData("pickles","Pickles",$explodedtext);
                    echo loadData("jalapeno","Jalepeños",$explodedtext);
                    echo loadData("green-peppers","Green Peppers",$explodedtext);
                    echo loadData("hummus","Hummus",$explodedtext);
                    echo loadData("banana-peppers","Banana Peppers",$explodedtext);
                    ?>
                </fieldset>
                <fieldset>
                    <legend>Sauces</legend>
                    <?php 
                    echo loadData("hot-sauce","Hot Sauce",$explodedtext);
                    echo loadData("ranch","Ranch",$explodedtext);
                    echo loadData("mayo","Mayonnaise",$explodedtext);
                    echo loadData("ua-sauce","UA Sauce",$explodedtext);
                    ?>
                </fieldset>
                <button type="submit" class="submit">Save Changes</button>
            </form>
        </main>
    </body>
</html>

