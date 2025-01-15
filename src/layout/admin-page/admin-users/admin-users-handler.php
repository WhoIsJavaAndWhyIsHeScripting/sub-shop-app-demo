<?php 
    if (isset($_POST)) {
            $user = $_POST["banned-name"];
            $banlist = fopen("ban-list.csv", "a");
        if (filesize("ban-list.csv") == 0) {
            fwrite($banlist, "$user");
        } else {
            fwrite($banlist, ",$user");
        }
    }
    //redirect back to page
    header("Location: admin-users.php");
    exit;

?>