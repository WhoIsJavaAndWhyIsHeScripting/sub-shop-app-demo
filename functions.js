function googleLibraryLoaded() {
  googleAuth();
}

function googleAuth() {
  console.log("googleAuth is running!");

  google.accounts.id.initialize({
    client_id: "702804890232-pj9j2siaa55563pild655ev156i36un5.apps.googleusercontent.com",
    callback: handleCredentialResponse,
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
  console.log("Google ID token: " + response.credential);
  document.cookie = "email=" + parseJwt(response.credential).email + "; path=/order";
}

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function isValidAccount(userEmail){
    return userEmail.split('@')[1] === 'uaschools.org';
}
