/** A collection of functions for client side form verification and submission. */

// get the file that lists out of stock ingredients
async function fetchy() {
    const fetcher = await fetch("/out-of-stock");
    let data = await fetcher.text();
    return data;
}

fetchy()
    .then((data) => {
        var dataSplit = data.split(",");
        var checkboxes = document.querySelectorAll("input[type='checkbox'], input[type='radio']");
        checkboxes.forEach((checkbox) => {
            for (let i in dataSplit) {
                // for each checkbox, iterate thru the list of out of stock ingredients, and if it matches one, disable it
                if (dataSplit[i] == checkbox.id.trim()) {
                    checkbox.disabled = true;
                }
            }
        })
    })

// simplifying disabling elements to get rid of the like 10 near-identical lines of code when disabling length for salad
function disableElement(element, bool) {
    if (bool == true) {
        document.getElementById(element).checked = !bool;
    }
    document.getElementById(element).disabled = bool;
}
// disable options for length and toasting if "salad" is checked as base
/*function disableSaladLength() {
    if (document.getElementById("salad").checked) {
        disableElement("6-inch", true);
        disableElement("12-inch", true);
        disableElement("toasted", true);
        disableElement("not-toasted", true);
    } else {
        disableElement("6-inch", false);
        disableElement("12-inch", false);
        disableElement("toasted", false);
        disableElement("not-toasted", false);
    }
}*/
// all categories of ingredients of the order
var itemList = ["period", "inch", "bread", "toasted", "protein", "veggies", "condiments"];
// saves the current boxes checked to localStorage
function saveOrder() {
    for (let itemName of itemList) {
        localStorage.setItem(itemName, findChecked(`input[name="${itemName}"]`));
    }
}
// loads the order from localStorage and adds event listeners to checkboxes to save it when the order is changed
function loadOrder() {
    for (let itemName of itemList) {
        var checkedItems = localStorage.getItem(itemName);
        if (checkedItems != null && checkedItems.length > 0) {
            //split the list of ingredients checked into an array
            var checkedList = checkedItems.split(", ");
            //grab a list of all checkboxes in the category
            var inputGroup = document.querySelectorAll(`input[name="${itemName}"]`);
            inputGroup.forEach((input) => {
                // if the checkbox is in the checked list, check the checkbox
                if (checkedList.indexOf(input.parentElement.textContent.trim()) != -1) {
                    input.checked = true;
                }
            })
        }
    }

    var checkboxes = document.querySelectorAll("input[type='checkbox'], input[type='radio']");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", saveOrder);
    });

    /*disableSaladLength();*/
}

var loaded = false;
//Shows a summary of the order. 
function loadSummary() {
    // if summary has already been loaded, discard old summary
    if (loaded == true) {
        document.getElementById("container").remove();
    }
    var orderForm = document.getElementById("the-form");
    // create a container for the summary
    var container = document.createElement('div');
    container.id = "container";
    orderForm.appendChild(container);
    var baseText = "";
    var len = findChecked('input[name="inch"]');
    var base = findChecked('input[name="bread"]');
    var toast = findChecked('input[name="toasted"]');
    if (base == "Salad" || base == "None" || len == "None") {
        baseText = `\nBase: ${base}`;
    } else if (toast == "No" || toast == "None") {
        baseText = `\nBase: ${len} ${base}`;
    } else {
        baseText = `\nBase: Toasted ${len} ${base}`;
    }
    var protein = findChecked('input[name="protein"]');
    var toppings = findChecked('input[name="veggies"]');
    var sauces = findChecked('input[name="condiments"]');
    var head = document.createElement('h1');
    head.textContent = "Here is your order:";
    container.appendChild(head);
    // add rows displaying all the boxes you checked
    var p1 = document.createElement('p');
    p1.textContent = baseText;
    if (baseText.trim() == "Base:") {
        p1.textContent += " None";
    }
    container.appendChild(p1);
    var p2 = document.createElement('p');
    p2.textContent = "Protein: " + protein;
    if (protein == "") {
        p2.textContent += "None";
    }
    container.appendChild(p2);
    var p3 = document.createElement('p');
    p3.textContent = "Toppings: " + toppings;
    if (toppings == "") {
        p3.textContent += "None";
    }
    container.appendChild(p3);
    var p4 = document.createElement('p');
    p4.textContent = "Sauce: " + sauces;
    if (sauces == "") {
        p4.textContent += "None";
    }
    container.appendChild(p4);
    if (loaded == false) {
        var submitter = document.querySelector('input[type="submit"]');
        submitter.style = "visibility: visible";
        var goBack = document.createElement("a");
        goBack.textContent = "Cancel";
        goBack.href = "/";
        goBack.onclick = localStorage.clear();
        goBack.id = "goBackButton";
        document.getElementById("goBack").appendChild(goBack);
    }
    loaded = true;
}

// finds all the checkboxes that are checked
// query - the query selector for the checkboxes you want e.g. input[name="orange"];
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
// loads the summary and reloads it each time your order is changed
function responsiveSummary() {
    loadSummary();
    var checkboxes = document.querySelectorAll("input[type='checkbox'], input[type='radio']");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", loadSummary);
    });
}

// Submitting order 

async function check_user() {
    const data = await fetch("/check-user");
    if (!data.ok) {
        throw new Error('Error from server: ' + data);
    }
    //console.log(data.status); 
    const data_obj = await data.json();

    if (data_obj.has_ordered || data_obj.is_banned) {
        return false;
    } else {
        return true;
    }
}

// checks to see if the user has ordered today and stores the result in a global 
check_user()
    .then((result) => {
        Object.defineProperty(window, "ALLOWED_TO_ORDER", {
            value: result,
            writable: false,
            configurable: false
        });
    });

// check if the user has an email entered
function checkLoginStatus() {
    if (document.cookie.match("email=") == null) {
        return false;
    } else {
        return true;
    }
}

function submitOrder(event) {
    //alert("Form being checked."); 

    // verify that the user has not already submitted an order 
    if (/*checkLoginStatus() == false*/) {
        alert("Error: You are not logged in. Please try again.");
        event.preventDefault();
        return;
    } else if (!window.ALLOWED_TO_ORDER) {
        alert("Sorry, you are not allowed to order. Users are limited to one order per day.");
        event.preventDefault();
        return;
    } else {
        //Checks bread and meats and cheeses. 
        const [valid, period] = validate_form(event);

        //Finally, it thanks the user and reminds them when they can pick it up.
        if (valid == true) {
            // delete all order cookies
            var cookieList = ["period", "inch", "bread", "toasted", "protein", "veggies", "condiments"];
            var date = new Date("1-1-1923");
            for (let cookieName of cookieList) {
                document.cookie = `${cookieName}=; expires=${date}`;
            }
            localStorage.clear();
            alert("Thank you for your order! \n Please remember to pick up your sandwich during " + period + " period lunch.");
        }
    }
}

function countMeatsAndCheeses() {
    var proteins = document.getElementsByName("protein");
    var total = 0;
    for (let i = 0; i < proteins.length; ++i) {
        if (proteins[i].checked) {
            total++;
        }
    }
    return total;
}

function validate_form(event) {
    var valid = true;

    //Check for a base 
    var breads = document.getElementsByName("bread");
    var bread_total = 0;
    for (let i = 0; i < breads.length; ++i) {
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
        /*if (!document.getElementById("salad").checked) {
            if (!document.getElementById("6-inch").checked && !document.getElementById("12-inch").checked) {
                alert("You must select a length or select a salad.");
                event.preventDefault();
                valid = false;
            }
            if (!document.getElementById("toasted").checked && !document.getElementById("not-toasted").checked) {
                alert("Please select whether you want your sandwich toasted.");
                event.preventDefault();
                valid = false;
            }
        }*/
    }


    //Check meats and cheeses (no more than 3 allowed)
    var total = countMeatsAndCheeses();
    if (total > 3) {
        alert("You may only select a total of three meats and cheeses. You have " + total.toString() + ".");
        event.preventDefault(); //prevents form submission 
        valid = false;
    } else {
        //Reminds the user that length is ignored when selecting a salad. (Not actually needed anymore.)
        /*const salad = document.querySelector('input[id="salad"]');
        const lengths = document.querySelectorAll('input[name="inch"]');
        if (salad.checked && (lengths[0].checked || lengths[1].checked)) {
            alert("Length is ignored for salads. \n(No 12 inch salads!)");
        }*/
    }

    // check if period is selected
    var periods = document.getElementsByName("period");
    var period = "";
    for (let i = 0; i < periods.length; ++i) {
        if (periods[i].checked) {
            period = periods[i].value;
        }
    }
    if (period == "") {
        event.preventDefault();
        valid = false;
        alert("You must select a period to pick up.");
    }
    //alert("Done checking form.");
    return [valid, period];
}

