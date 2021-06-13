import React from "react";
//https://reactrouter.com/web/example/auth-workflow
//https://usehooks.com/useAuth/
import { BrowserRouter, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { IsNetworkOnline } from "../../utils/network";
import Board from "../Board";
import BoardList from "../BoardList/index.js";
import SignIn from "../SignIn/index.js";

const Landing = () => {
	//define {authError, user, funcLogOut } with weird js object destructuring bullshit
	var { AuthAPI_Error: authError, AuthAPI_CurrentUser: authCurrentUser } =
		useAuth();

	//#region Authentication

	if (!IsNetworkOnline())
		return (
			<div>
				<h1 className="MajorError">
					No Internet connection detected!Please connect and try again
				</h1>
			</div>
		);

	//error while logging in
	if (authError)
		return (
			<div>
				<h1>"Error"{/*authObject.error*/}</h1>
				<button

				//onClick={loginWithGoogle}
				>
					Retry Login
				</button>
			</div>
		);

	//Not logged in
	if (false === authCurrentUser) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <SignIn />;
	}

	if (null === authCurrentUser) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <span>Loading...</span>;
	}

	//#endregion

	return (
		<BrowserRouter>
			<Route exact path="/">
				<BoardList />
			</Route>

			<Route path="/board/:boardId">
				<Board CurrentUserData={authCurrentUser} />
			</Route>
		</BrowserRouter>
	);
};

export default Landing;
