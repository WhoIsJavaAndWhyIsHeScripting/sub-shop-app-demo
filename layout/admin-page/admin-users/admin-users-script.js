// get open status
async function getOpenStatus() {
    const data = await fetch('/open-close');
    if (!data.ok) throw err;
    const json = await data.json();
    return json.open;
}

async function getCloseTime() {
    const data = await fetch('/get-closing-time');
    const json = await data.json();
    document.getElementById("current-time").textContent = json.closetime;
}
// update button text based on whether the store is open or closed
async function updateCloseButton() {
    let closeButton = document.getElementById("close-button");
    var status = await getOpenStatus();
    if (status == "true") {
        closeButton.innerHTML = "The sub shop is currently <b>OPEN</b> and accepting orders today. Click to close shop.";
        closeButton.className = "shop-open";
    } else if (status == "false") {
        closeButton.innerHTML = "The sub shop is currently <b>CLOSED</b> and NOT accepting orders today. Click to open shop.";
        closeButton.className = "shop-closed";
    } else {
        alert(status);
    }

}

async function getCurrentLimit() {
    const data = await fetch('/order-limit');
    if (!data.ok) throw err;
    const json = await data.json();
    document.getElementById("order-limit").placeholder = json.limit;
}

// remove a list item
function remove(e) {
    let hiddenInput = document.createElement("input");
    hiddenInput.name = "hidden";
    let textcontent = e.parentElement.textContent;
    let subtext = textcontent.substring(0, textcontent.length - 1);
    let formUsers = document.forms["users-form"];
    formUsers["hidden"].value = subtext;
    hiddenInput.value = subtext;
    formUsers.appendChild(hiddenInput);
    formUsers.submit();
}   