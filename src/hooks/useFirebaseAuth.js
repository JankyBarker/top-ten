import { useState, useEffect, useCallback } from "react";
import "firebase/auth";
import { firebase } from "../components/Firebase/fbConfig.js";

const useFirebaseAuth = () => {
	const [FireBase_CurrentUser, setUser] = useState(null);
	const [FireBase_Error, setError] = useState(false);

	const memoizedCallback = useCallback(
		(newUser) => {
			setError(null);

			// if (FireBase_CurrentUser === newUser) {
			// 	return;
			// }

			if (newUser) {
				setUser(newUser);
				//console.log(newUser.isAnonymous ? "Anon" : newUser.email);
			} else {
				setUser(false);
			}
		},
		[
			/*FireBase_CurrentUser*/
		]
	);

	useEffect(() => {
		// listen for auth state changes
		const unsubscribe = firebase.auth().onAuthStateChanged(memoizedCallback);

		// Cleanup subscription on unmount
		return function cleanup() {
			unsubscribe();
		};
	}, [memoizedCallback]);

	const FireBase_LoginAnon = () => {
		setUser(null);
		return firebase
			.auth()
			.signInAnonymously()
			.then(function (userCredential) {
				//set the user so that other dependents don't have to rely on onAuthStateChanged events
				setUser(userCredential.user);
				return userCredential;
			});
	};

	const FireBase_LoginEmail = (email, password) => {
		return firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(function (userCredential) {
				//set the user so that other dependents don't have to rely on onAuthStateChanged events
				setUser(userCredential.user);
				return userCredential;
			}); //return promise
	};

	const FireBase_LogOut = () => {
		setUser(null);
		return firebase.auth().signOut(); //return promise
	};

	const authAPI = {
		AuthAPI_Error: FireBase_Error,
		AuthAPI_CurrentUser: FireBase_CurrentUser,
		AuthAPI_LoginAnon: FireBase_LoginAnon,
		AuthAPI_LoginEmail: FireBase_LoginEmail,
		AuthAPI_LogOut: FireBase_LogOut,
	};

	return authAPI;
};

export default useFirebaseAuth;
