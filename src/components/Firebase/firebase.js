import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

class Firebase {
	constructor() {
		this.auth = app.auth();
		this.db = app.database();

		// *** Auth API ***
		this.doCreateUserWithEmailAndPassword = (email, password) =>
			this.auth.createUserWithEmailAndPassword(email, password);

		this.doSignInWithEmailAndPassword = (email, password) =>
			this.auth.signInWithEmailAndPassword(email, password);

		this.doSignOut = () => this.auth.signOut();

		this.doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

		this.doPasswordUpdate = (password) =>
			this.auth.currentUser.updatePassword(password);

		// *** User API ***
		this.user = () => {
			var myUserId = this.auth.currentUser.uid;
			return this.db.ref(`users/${myUserId}`);
		};

		this.users = () => this.db.ref("users");

		this.toptens = () => {
			var myUserId = this.auth.currentUser.uid;
			return this.db.ref(`toptens/${myUserId}`).orderByChild("priority");
		};

		this.movie = (movie_id) => {
			var myUserId = this.auth.currentUser.uid;
			return this.db.ref(`toptens/${myUserId}/${movie_id}`);
		};

		this.SaveMovie = (movieName) => {
			var newMessageRef = this.toptens().push();
			newMessageRef.set({
				text: movieName,
				priority: 0,
			});
		};

		this.RemoveMovie = (movie_id) => {
			var movieRef = this.movie(movie_id);

			movieRef
				.remove()
				.then(function () {
					console.log("Remove succeeded.");
				})
				.catch(function (error) {
					console.log("Remove failed: " + error.message);
				});
		};
	}
}

export default Firebase;
