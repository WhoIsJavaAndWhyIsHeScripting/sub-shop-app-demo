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