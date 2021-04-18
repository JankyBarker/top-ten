import { useState, useEffect } from "react";
import "firebase/auth";
import { firebase } from "../components/Firebase/fbConfig.js";

export const AuthComponent = () => {
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(timeLeft + 1);
		}, 1000);

		// Clear timeout if the component is unmounted
		return () => clearTimeout(timer);
	});

	return <div>{<span>Count: {timeLeft}</span>}</div>;
};

const useFirebaseAuth = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	function onChange(newUser) {
		if (newUser) {
			console.log("setUser: value " + newUser);
			setUser(newUser);
		} else {
			console.log("setError: Null User ");
			setError("Null User");
			setUser(newUser);
		}
	}

	useEffect(() => {
		// listen for auth state changes
		const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
		// unsubscribe to the listener when unmounting
		return () => unsubscribe();
	}, []);

	return [user, error];
};

export default useFirebaseAuth;
