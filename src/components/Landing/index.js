import React from "react";
import { firebase } from "../Firebase/fbConfig.js";
import { useState } from "react";

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	function onAttemptSignIn(event) {
		event.preventDefault();
		doSignInWithEmailAndPassword(email, password)
			.then(() => {
				//reset state
				setEmail("");
				setPassword("");

				//go home
				//this.props.history.push(ROUTES.HOME);
			})
			.catch((error) => {
				setError(error);
			});
	}

	const doSignInWithEmailAndPassword = (email, password) => {
		console.log("email is " + email);
		console.log(email);
		console.log("password is :");
		console.log(password);
		return firebase.auth().signInWithEmailAndPassword(email, password);
	};

	const loginAnonymously = (event) => {
		event.preventDefault();
		firebase
			.auth()
			.signInAnonymously()
			.then((user) => {
				console.log("Welcome Anon");
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

	const isInvalid = password === "" || email === "";

	return (
		<form>
			<input
				name="email"
				onChange={(event) => {
					setEmail(event.target.value);
				}}
				type="text"
				placeholder="Email Address"
			/>
			<input
				name="password"
				onChange={(event) => {
					setPassword(event.target.value);
				}}
				type="password"
				placeholder="Password"
			/>
			<button disabled={isInvalid} onClick={onAttemptSignIn}>
				Sign In
			</button>

			<button onClick={loginAnonymously}>
				Continue as Guest <sup>*</sup>
			</button>

			{error && <p>{error.message}</p>}
		</form>
	);
};

const Landing = () => {
	const logOut = (event) => {
		event.preventDefault();
		firebase.auth().signOut();
	};

	return (
		<div>
			<div>
				<div>
					{/* <h1>Welcome, {name ? name.split(" ")[0] : "Stranger"}</h1> */}
					<h1>Welcome, Stranger</h1>
					<button onClick={logOut}>Log out</button>
					<SignInForm />
				</div>
			</div>
		</div>
	);
};

export default Landing;
