<?php 
ini_set('display_errors', 'On');
error_reporting(E_ALL);
    echo "hi";
    var_dump(isset($_POST["banned-name"]));
// get name to add from input and write their name into the csv
    if (isset($_POST["banned-name"]) && $_POST["banned-name"] != "") {
        echo "a";
            $user = $_POST["banned-name"];
            echo "b";
            $banlist = fopen("ban-list.csv", "a");
            echo "c";
        if (filesize("ban-list.csv") == 0) {
            fwrite($banlist, "$user");
            echo "d";
        } else {
            fwrite($banlist, ",$user");
            echo "e";
        }
    }
    echo "hi";
    var_dump($_POST["hidden"]);
    var_dump(isset($_POST["hidden"]));
    if (isset($_POST["hidden"])) {
        echo 'start';
        $remove = $_POST["hidden"];
        $banlist = fopen("ban-list.csv", "r");
        echo "opened";
        $users = fread($banlist, filesize("ban-list.csv"));
        echo "read";
        $split = explode(",", $users);
        var_dump($split);
        echo "hello";
        $index = array_search($remove, $split);
        array_splice($split, $index, 1);
        $banlistw = fopen("ban-list.csv", "w");
        echo "opened againnnn";
        foreach ($split as $str) {
            if ($str == $split[0]) {
                fwrite($banlistw, "$str");
            } else {
                fwrite($banlistw, ",$str");
            }
        }
        echo "written";
    }
    //redirect back to page
    header("Location: admin-users.php");
   exit;
?>