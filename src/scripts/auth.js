function login() {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}