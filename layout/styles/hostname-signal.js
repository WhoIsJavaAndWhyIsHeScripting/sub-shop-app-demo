/**
 * Returns a color that varies based on the hostname of the server. 
 * This is used to easily distinguish between the dev and production servers.
 * 
 * @returns a string representing a color in hex format
 */
/*function getColor() {
    let hostname = window.location.hostname;
    switch (hostname) {
        case "subshop-dev.uaschools.io": return "#f4fbec";
        case "subshop.uaschools.io": return "inherit";  // probably will be white
        default: return "#fef1f1";
    }
}*/

document.body.style.background = getColor();
