import { useState, useEffect } from "react";
import "firebase/auth";
import { firebase } from "../components/Firebase/fbConfig.js";
const DELAY_COUNT = 0; //1 * 1000;

const useFirebaseAuth = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(false);

	function onChange(newUser) {
		//console.log("onChange: newUser " + newUser);
		const delayTimeout = () => {
			console.log("setUser: delayed " + newUser);

			if (newUser) {
				console.log("setUser: value " + newUser);
				setUser(newUser);
			} else {
				console.log("setError: Null User ");
				setError("false User");
				setUser(false);
			}

			setError(null);
		};

		let timeoutId;
		const cancel = () => timeoutId && clearTimeout(timeoutId); //returns timeoutId and clears the timeout of that id
		timeoutId = setTimeout(delayTimeout, DELAY_COUNT);

		return cancel;
	}

	useEffect(() => {
		// listen for auth state changes
		const unsubscribe = firebase.auth().onAuthStateChanged(onChange);

		return function cleanup() {
			unsubscribe();
			console.log("unsubbed");
		};
	}, []);

	const FireBaseLoginAnon = () => {
		setUser(null);
		firebase
			.auth()
			.signInAnonymously()
			.then((user) => {
				//console.log("Welcome Anon");
				// 	//createBoardForAnons(user.user.uid)
			})
			.catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				//var errorMessage = error.message;

				if (errorCode === "auth/admin-restricted-operation") {
					alert("You must enable Anonymous auth in the Firebase Console?");
				} else {
					console.error(error);
				}
			});
	};

	const FireBaseLoginEmail = (email, password) => {
		return firebase.auth().signInWithEmailAndPassword(email, password);
	};

	const FireBaseLogOut = () => {
		setUser(null);
		firebase.auth().signOut();
	};

	const authAPI = {
		error,
		user,
		setUser,
		FireBaseLoginAnon,
		FireBaseLoginEmail,
		FireBaseLogOut,
	};

	return authAPI;
};

export default useFirebaseAuth;
