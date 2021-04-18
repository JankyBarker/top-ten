import React, { useContext, useState } from "react";
import { firebase } from "../Firebase/fbConfig.js";
import SignIn from "../SignIn";
import { IsNetworkOnline } from "../../utils/network";
import { UserContext } from "../../context/UserContext.js";
import UserProfile from "../UserProfile/UserProfile.js";

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
	const { user } = useContext(UserContext);

	const logOut = (event) => {
		event.preventDefault();
		firebase.auth().signOut();
	};

	if (!IsNetworkOnline())
		return (
			<span>No Internet connection detected! Please connect and try again</span>
		);

	//error while logging in
	if (false)
		return (
			<div>
				<h1>"Error"{/*authObject.error*/}</h1>
				<button
					className="bg-blue-600 text-3xl px-2 py-1"
					//onClick={loginWithGoogle}
				>
					Retry Login
				</button>
			</div>
		);

	var userName = "";
	//Not logged in
	if (user === false) {
		return <SignIn loginWithGoogle={null} signInAnon={null} />;
	}
	//state of loading
	if (user === null) {
		return (
			<div>
				<SignInForm />
			</div>
		);
	} else {
		if (user.isAnonymous === true) {
			userName = "Anon";
		} else {
			userName = user.email;
		}
	}

	return (
		<div>
			<UserProfile name={userName} />
			<button onClick={logOut}>Log out</button>
		</div>
	);
};

export default Landing;
