
fetchy()
.then((data) => {
    var dataSplit = data.split(",");
    var checkboxes = document.querySelectorAll("input[type='checkbox'], input[type='radio']");
    checkboxes.forEach((checkbox) => {
        for (i in dataSplit) {
            // for each checkbox, iterate thru the list of out of stock ingredients, and if it matches one, disable it
            if (dataSplit[i] == checkbox.id.trim()) {
                checkbox.disabled = true;
            }
        }
    })
})
    var loaded = false;
    //Shows a summary of the order. 
    function loadSummary() {
      function responsiveSummary() {
        loadSummary();
        var checkboxes = document.querySelectorAll("input[type='checkbox'], input[type='radio']");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", loadSummary);
        });
      }
      function loadSummary() {
        if (loaded == true) {
            document.getElementById("container").remove();
        }
         var orderForm = document.getElementById("the-form");
         var container = document.createElement('div');
         container.id = "container";
         orderForm.appendChild(container);
         var baseText = "";
         var len = findChecked('input[name="inch"]');
         var base = findChecked('input[name="bread"]');
         var toast = findChecked('input[name="toasted"]');
         if (base == "Salad" || base == "None" || len == "None") {
            baseText = `\nBase: ${base}`;
         } else if (toast == "No") {
            baseText = `\nBase: ${len} ${base}`;
         } else {
            baseText = `\nBase: Toasted ${len} ${base}`;
         }
         var protein = findChecked('input[name="protein"]');
         var toppings = findChecked('input[name="veggies"]');
         var sauces = findChecked('input[name="condiments"]');
         var head = document.createElement('h1');
         head.textContent = "Here is your order:"
         container.appendChild(head);
         var p1 = document.createElement('p');
         p1.textContent = baseText;
         if (baseText.trim() == "Base:") {
            p1.textContent += " None"
         }
         container.appendChild(p1);
         var p2 = document.createElement('p');
         p2.textContent = "Protein: " + protein;
         if (protein == "") {
            p2.textContent += "None"
         }
         container.appendChild(p2);
         var p3 = document.createElement('p');
         p3.textContent = "Toppings: " + toppings;
         if (toppings == "") {
            p3.textContent += "None"
         }
         container.appendChild(p3);
         var p4 = document.createElement('p');
         p4.textContent = "Sauce: " + sauces;
         if (sauces == "") {
            p4.textContent += "None"
         }
         container.appendChild(p4);
         if (loaded == false) {
             var submitter = document.querySelector('input[type="submit"]');
             submitter.style = "visibility: visible";
             var goBack = document.createElement("a");
             goBack.textContent = "Cancel";
             goBack.href = "/order";
             goBack.id = "goBackButton";
             document.getElementById("goBack").appendChild(goBack);
         }
         loaded = true;
      }
      function findChecked(query) {
         var itemsAll = document.querySelectorAll(query);
         var buttonchecked = "";
         itemsAll.forEach((item) => {
            if (item.checked == true) {
               if (buttonchecked == "") {
                  buttonchecked += item.parentElement.textContent.trim();
               } else {
                  buttonchecked += ", " + item.parentElement.textContent.trim();
               }
               
            }
         })
         if (buttonchecked == "") {
            buttonchecked = "None";
         }
         return buttonchecked;
      }
    }

    orderForm.addEventListener("submit", (event) => {
        //alert("Form being checked.")
         
        //Checks bread and meats and cheeses. 
        var valid = validate_form(); 
 
        //Finally, it thanks the user and reminds them when they can pick it up.
        if (valid == true) {
            var periods = document.getElementsByName("period"); 
            var period = ""; 
            for (let i=0; i < periods.length; ++i) {
                if (periods[i].checked) {
                    period = periods[i].value; 
                }
            }
            if (period == "") {
                event.preventDefault(); 
                valid = false; 
                alert("You must select a period to pick up.")
                return; 
            }
            alert("Thank you for your order! \n Please remember to pick up your sandwich during "+period+" period lunch.");
        }
     }); 
    function countMeatsAndCheeses() {
        var proteins = document.getElementsByName("protein"); 
        var total = 0; 
        for (let i=0; i < proteins.length; ++i) {
            if (proteins[i].checked) {
                total++; 
            }
        }
        return total; 
    }
 
    function validate_form() {
        var valid = true; 
 
        //Check for a base 
        var breads = document.getElementsByName("bread"); 
        var bread_total = 0; 
        for (let i=0; i < breads.length; ++i) {
            if (breads[i].checked) {
                bread_total++; 
            }
        }
        if (bread_total == 0) {
            alert("You must select a base (bread type)."); 
            event.preventDefault(); 
            valid = false; 
        } else {
            //check that the user chose a length or chose a salad 
            if (!document.getElementById("salad").checked && !document.getElementById("6-inch").checked && !document.getElementById("12-inch").checked)  {
                alert("You must select a length or select a salad."); 
                event.preventDefault(); 
                valid = false;
            }
        }
        //Check meats and cheeses (no more than 3 allowed)
        var total = countMeatsAndCheeses();
        if (total > 3) {
            alert("You may only select a total of three meats and cheeses. You have "+total.toString()+"."); 
            event.preventDefault(); //prevents form submission 
            valid = false; 
        } else {
            //Reminds the user that length is ignored when selecting a salad. (Not actually needed anymore.)
            const salad = document.querySelector('input[value="salad"]');  
            const lengths = document.querySelectorAll('input[name="inch"]'); 
            if (salad.checked && (lengths[0].checked || lengths[1].checked)) {
                alert("Length is ignored for salads. \n(No 12 inch salads!)");
            } 
        }
        return valid; 
    }
