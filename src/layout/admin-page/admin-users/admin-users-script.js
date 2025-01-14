let allItems = document.querySelectorAll(".list");
let allRemovers = document.querySelectorAll(".remover")
for (let remover in allRemovers) {
     remover.addEventlistener("click", function(e) {
        let idThing = e.target.getAttribute("id");
        document.getElementById("demo").innerHTML = "idThing: ";
         let item = document.getElementById("list" + idThing);
        item.style.display = hidden;;
     });
}
