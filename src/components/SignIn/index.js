import React, { useState } from "react";
import "skeleton-css/css/normalize.css";
import "skeleton-css/css/skeleton.css";
import PhoneImage from "../../assets/iphone.png";
import { useAuth } from "../../context/AuthContext.js";
import assert from "../../utils/assert.js";
import "./style.css";

function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	//define {funcLoginAnon, funcLoginEmail} with weird js object destructuring bullshit
	var { AuthAPI_LoginAnon: funcLoginAnon, AuthAPI_LoginEmail: funcLoginEmail } =
		useAuth();

	assert(typeof funcLoginAnon !== "undefined", "funcLoginAnon: Undefined");
	assert(typeof funcLoginEmail !== "undefined", "funcLoginEmail: Undefined");

	function onAttemptSignIn(event) {
		event.preventDefault();

		//remember: once auth is complete this SignIn form no longer renders
		funcLoginEmail(email, password) //returns Promise
			.catch((error) => {
				setError(error);
			});
	}

	const loginAnonymously = (event) => {
		event.preventDefault();

		//remember: once auth is complete this SignIn form no longer renders
		funcLoginAnon() //returns Promise
			.catch((error) => {
				setError(error);
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

export default SignIn;
