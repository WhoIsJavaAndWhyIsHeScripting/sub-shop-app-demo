/** These are functions for Google authentication. They run on the client side. */

// This is called on subShopOrder.html when the Google client is loaded. 
function googleLibraryLoaded() {
  googleAuth();
}

function googleAuth() {
  console.log("googleAuth is running!");

  google.accounts.id.initialize({
    client_id: "702804890232-pj9j2siaa55563pild655ev156i36un5.apps.googleusercontent.com",
    ux_mode: "redirect",
    login_uri: "https://subshop-dev.uaschools.io/order"
  });
  google.accounts.id.renderButton(
    document.getElementById("proceed"),
    { theme: "outline", size: "large" }  // customization attributes
  );
}

function handleCredentialResponse(response) {
  /* handle invalid emails here
   * if(!isValidAccount(email)){
   *   
   * } else {
   */
  // console.log("Google ID token: " + response.credential);
  document.cookie = "email=" + parseJwt(response.credential).email + "; path=/order";
}

// Verifying the domain of the email is done by Google Auth itself, so this
// function is not actually needed. 
function isValidAccount(userEmail) {
  return userEmail.split('@')[1] === 'uaschools.org';
}
