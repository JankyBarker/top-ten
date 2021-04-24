import React, { useState } from "react";
import { IsNetworkOnline } from "../../utils/network";
import UserProfile from "../UserProfile/UserProfile.js";
import { useAuth } from "../../context/AuthContext.js";

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	var { LoginAnon: funcLoginAnon, LoginEmail: funcLoginEmail } = useAuth();

	function onAttemptSignIn(event) {
		event.preventDefault();
		console.log("email is " + email);
		console.log(email);
		console.log("password is :");
		console.log(password);

		funcLoginEmail(email, password) //returns Promise
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

	const loginAnonymously = (event) => {
		event.preventDefault();
		funcLoginAnon();
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
			{error && <p>{error.message}</p>}

			<button onClick={loginAnonymously}>
				Continue as Guest <sup>*</sup>
			</button>
		</form>
	);
};

const Landing = () => {
	//var { user } = useContext(UserContext);

	//define {authError, user, funcLogOut } with weird js object destructuring bullshit
	var { error: authError, currentUser: user, Logout: funcLogOut } = useAuth();

	if (!IsNetworkOnline())
		return (
			<span>No Internet connection detected! Please connect and try again</span>
		);

	//error while logging in
	if (authError)
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
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <SignInForm />;
	}
	//state of loading
	if (user === null) {
		return <span>Loading</span>;
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
			<button onClick={funcLogOut}>Log out</button>
		</div>
	);
};

export default Landing;
