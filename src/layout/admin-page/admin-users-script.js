/* when the "Add User" button is clicked, 
take the input value and put in into the banned list. */
function addUser() {
    let newUser = document.getElementById("banned-name").value;
    let list = document.getElementById("ban-list");
    let listItem = document.createElement("li");
    let userNode = document.createTextNode(newUser);
    let removeButton = document.createElement("button");
    let removeNode = document.createTextNode("\u00D7");
    
    removeButton.appendChild(removeNode);
    listItem.appendChild(userNode);
    listItem.appendChild(removeButton);
    list.appendChild(listItem);

    removeButton.addEventListener("click", function() {
        listItem.style.display = "none";
    });
}