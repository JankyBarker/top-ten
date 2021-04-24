import { useState, useEffect } from "react";
import "firebase/auth";
import { firebase } from "../components/Firebase/fbConfig.js";
const DELAY_COUNT = 0;

const useFirebaseAuth = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	function onChange(newUser) {
		//console.log("onChange: newUser " + newUser);
		const delayTimeout = () => {
			console.log("setUser: delayed " + newUser);

			if (newUser) {
				console.log("setUser: value " + newUser);
				setUser(newUser);
			} else {
				console.log("setError: Null User ");
				setError("Null User");
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

	// const loginAnonymously = () => {
	// 	firebase
	// 		.auth()
	// 		.signInAnonymously()
	// 		.then((user) => {
	// 			//do stuff
	// 		});
	// };

	// const logOut = () => {
	// 	firebase.auth().signOut();
	// 	setUser(null);
	// };

	return [user, error];
};

export default useFirebaseAuth;
