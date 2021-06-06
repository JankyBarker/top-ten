import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import assert from "../../utils/assert.js";
import "skeleton-css/css/normalize.css";
import "skeleton-css/css/skeleton.css";
import "./style.css";
import PhoneImage from "../../assets/iphone.png";

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
		<div>
			<div className="section hero">
				<div className="container">
					<div className="row">
						<div className="one-half column">
							<h4 className="hero-heading">
								Suggest what your friends and family should watch with Top Ten!
							</h4>
							<a
								className="button button-primary"
								href="http://getskeleton.com"
							>
								Try Top Ten!
							</a>
						</div>
						<div className="one-half column phones">
							<img className="phone" src={PhoneImage} alt="Phone" />
							<img className="phone" src={PhoneImage} alt="Phone" />
						</div>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="docs-section" id="forms">
					<h6 className="docs-header">Sign In</h6>
					<p>Login to save your recommendations!</p>
					<div className="docs-example docs-example-forms">
						<form>
							<div className="row">
								<div className="four columns value">
									<input
										className="u-full-width"
										type="email"
										placeholder="test@mailbox.com"
										id="exampleEmailInput"
										onChange={(event) => {
											setEmail(event.target.value);
										}}
									/>
								</div>
								<div className="four columns value">
									<input
										className="u-full-width"
										type="password"
										placeholder="Password"
										name="password"
										onChange={(event) => {
											setPassword(event.target.value);
										}}
									/>
								</div>
								<div className="four columns value">
									<button
										className="button-primary"
										disabled={isInvalid}
										onClick={onAttemptSignIn}
									>
										Sign In
									</button>
									{error && <p>{error.message}</p>}
								</div>
							</div>

							<button onClick={loginAnonymously}>
								Continue as Guest <sup>*</sup>
							</button>

							<p>
								<sup>*</sup> Your data will be deleted once you log out.
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

// eslint-disable-next-line
function SignIn_old() {
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
