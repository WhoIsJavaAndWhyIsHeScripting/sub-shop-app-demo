
<?php
    // turns list of checked boxes into a csv file
    $ingredients = $_REQUEST['ingredient'];
    $file = fopen("out-of-stock.csv", "w");
    fputcsv($file, $ingredients, ",", '"', '');
    //redirect back to admin ingredients page
    header("Location: admin-ingredients.php");
    exit;
?>

