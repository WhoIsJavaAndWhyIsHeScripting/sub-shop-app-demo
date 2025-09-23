// function googleLibraryLoaded() {
//   googleAuth();
// }

// function googleAuth() {
//   console.log("googleAuth is running!");

//   google.accounts.id.initialize({
//     client_id: "702804890232-pj9j2siaa55563pild655ev156i36un5.apps.googleusercontent.com",
//     //callback: handleCredentialResponse,
//     ux_mode: "redirect",
//     login_uri: "https://subshop-dev.uaschools.io/order" // does work on local host
//   });
//   google.accounts.id.renderButton(
//         document.getElementById("proceed"),
//         { theme: "outline", size: "large" }  // customization attributes
//   );
// }

// function handleCredentialResponse(response) {
//   /* handle invalid emails here
//    * if(!isValidAccount(email)){
//    *   
//    * } else {
//    */
//   console.log("Google ID token: " + response.credential);
//   document.cookie = "email=" + parseJwt(response.credential).email + "; path=/order";
// }

// function isValidAccount(userEmail){
//     return userEmail.split('@')[1] === 'uaschools.org';
// }
