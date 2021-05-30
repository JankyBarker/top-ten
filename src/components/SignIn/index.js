import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import assert from "../../utils/assert.js";

function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	//define {funcLoginAnon, funcLoginEmail} with weird js object destructuring bullshit
	var { AuthAPI_LoginAnon: funcLoginAnon, AuthAPI_LoginEmail: funcLoginEmail } =
		useAuth();

	let history = useHistory();

	assert(typeof funcLoginAnon !== "undefined", "funcLoginAnon: Undefined");
	assert(typeof funcLoginEmail !== "undefined", "funcLoginEmail: Undefined");

	let { from } = { from: { pathname: "/" } };

	function onAttemptSignIn(event) {
		event.preventDefault();

		funcLoginEmail(email, password) //returns Promise
			.then(() => {
				//reset state
				setEmail("");
				setPassword("");

				//after login
				history.replace(from);

				console.log("going to:" + from);
			})
			.catch((error) => {
				setError(error);
			});
	}

	const loginAnonymously = (event) => {
		event.preventDefault();

		funcLoginAnon().then(() => {
			//after login
			history.replace(from);
			console.log("going to:" + from.pathname);
		});
	};

	const isInvalid = password === "" || email === "";

	return (
		<div className="SignInBlock">
			<h1 className="SignInHeader">
				Suggest what your friends and family should watch with Top Ten!
			</h1>
			<p className="SignInCopy">
				Top Ten is a simple list app to track and organise your movie
				recommendations.
			</p>

			<div className="SignInButtonDiv">
				<button
					className="BlueButton"
					// onClick={loginWithGoogle}
				>
					Continue with Google
				</button>
				<button
					className="GreyButton"
					// onClick={signInAnon}
				>
					Continue as Guest <sup>*</sup>
				</button>
			</div>

			<form>
				<p>You must log in!</p>
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
		</div>
	);
}

export default SignIn;
