/* when the "Add User" button is clicked, 
take the input value and put in into the banned list. */
function addUser() {
    // create new elements and get existing ones 
    let newUser = document.getElementById("banned-name").value;
    let list = document.getElementById("ban-list");
    let listItem = document.createElement("li");
    let userNode = document.createTextNode(newUser);
    let removeButton = document.createElement("button");
    let removeNode = document.createTextNode("\u00D7");
    /* add all elements to their correct place.
    the tree of elements should look like this:
    -list
    --listItem
    ---userNode
    ---removeButton
    */
    removeButton.appendChild(removeNode);
    listItem.appendChild(userNode);
    listItem.appendChild(removeButton);
    list.appendChild(listItem);
    // style close buttons 
    removeButton.className = "remover";
    // add functionality to remove buttons
    removeButton.addEventListener("click", function() {
        listItem.style.display = "none";
    });
}