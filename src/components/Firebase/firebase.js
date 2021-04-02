import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();

    // *** Auth API ***
    this.doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    this.doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    this.SaveMovie = (movieName) => {
      var newMessageRef = this.toptens().push();

      newMessageRef.set({
        user_id: this.auth.currentUser.uid,
        text: movieName,
      });
    };

    this.RemoveMovie = (uid) => {
      var movieRef = this.movie(uid);

      movieRef
        .remove()
        .then(function () {
          console.log("Remove succeeded.");
        })
        .catch(function (error) {
          console.log("Remove failed: " + error.message);
        });
    };

    this.doSignOut = () => this.auth.signOut();

    this.doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

    this.doPasswordUpdate = (password) =>
      this.auth.currentUser.updatePassword(password);

    // *** User API ***
    this.user = (uid) => this.db.ref(`users/${uid}`);
    this.users = () => this.db.ref("users");

    this.toptens = () => this.db.ref("toptens");
    this.movie = (uid) => this.db.ref(`toptens/${uid}`);
  }
}

export default Firebase;
