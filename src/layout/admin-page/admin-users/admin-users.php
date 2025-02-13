<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>Manage Users</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="admin-users-styles.css" rel="stylesheet">
    </head>
    <?php 
    $banlist = fopen("ban-list.csv", "r");
    if (filesize("ban-list.csv") > 0) {
        $ban = fread($banlist, filesize("ban-list.csv"));
    } else {
        $ban = "";
    }
    $banexploded = explode(",", $ban);
    ?>
    <body>
        <header>
            <div class="headerbar"><img src="/src/assets/bearbiteslogo.png"><a href="../admin-home/admin-home.html">Bear Bites</a></div>
        </header>
        <main>
            <h1>Manage Users</h1>
            <p>
                If a student ordered a sandwich and 
                did not come to the sub shop to pay 
                for it, type in their full name to add 
                them to the no-access list. Students on
                the no-access list will not be able to order
                online, but they will still be able to buy
                subs in person. <br><br>Click "Save Changes" 
                when you are done to save your changes to the 
                no-access list.
            </p>
            <hr>
            <form id="users-form" action="admin-users-handler.php" method="POST">
                <label for="banned-name">Name of student to add: 
                <input type="text" id="banned-name" name="banned-name"></label> <button type="submit">Add User</button>
            </form>
            <h2>No-access list</h2>
            <p>
                In the case of a mistake, you can click on 
                the "X" next to a student's name to 
                remove them from the no-access list.
            </p>
            <ul id="ban-list">
                <?php 
                    $i = 0;
                    foreach ($banexploded as $item) {
                        echo "<li class=\"list\"id=\"list$i\">$item<button class=\"remover\" id=\"remover$i\" onclick=\"remove(this)\">X</button></li>";
                        $i++;
                    }
                ?>
            </ul>
        </main>
    </body>
     <!--import js-->
     <script src="admin-users-script.js"></script>
</html>