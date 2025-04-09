import {getAuth, signOut, GoogleAuthProvider, signInWithRedirect} from "firebase/auth";

async function authWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    // Start sign in for unauthenticated user, triggers a page redirect
    signInWithRedirect(auth, provider)
        .then((result) => {
            // Gives a Google Access Token, can be used to access Google APIs
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info
            const user = result.user;

        }).catch((error) => {
        // Handle errors here

    });
}

function createGoogleButton(){
    function handleCredentialResponse(response){
        console.log("Encoded JWT ID token: " + response.credential);
    }
    google.accounts.id.initialize({
        client_id: "702804890232-pj9j2siaa55563pild655ev156i36un5.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt();
}

function signOut(){
    const auth = getAuth();
    signOut(auth).then(() => {
        // sign out successful
    }).catch((error) => {
        // error handling
    });
}

function isValidAccount(userEmail){
    return userEmail.split('@')[1] === 'uaschools.org';
}