import React, { useRef, useState } from "react";
//https://reactrouter.com/web/example/auth-workflow
//https://usehooks.com/useAuth/
import {
	BrowserRouter,
	Link,
	Redirect,
	Route,
	Switch,
	useHistory,
} from "react-router-dom";
//import UserProfile from "../UserProfile/UserProfile.js";
import { useAuth } from "../../context/AuthContext.js";
import useBoardList from "../../hooks/useBoardList";
//import useTopTen from "../../hooks/useTopTen";
//import Board from "../Board";
//import ErrorBoundary from "../../utils/ErrorBoundary.js";
//import useDummyData from "../../hooks/useDummyData";
import assert from "../../utils/assert.js";
import { IsNetworkOnline } from "../../utils/network";
import Board from "../Board";
import Home from "../Home";
import SignIn from "../SignIn/index.js";

const SignInForm = () => {
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
		<form>
			<p>You must log in to view the page at {from.pathname}</p>
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

const AddBoardForm = ({ UserID: _UserID, CreateBoard: _createBoard }) => {
	const [boardNameInputText, setBoardNameInputText] = useState("");
	const inputEl = useRef(null);

	if (!_UserID) {
		return <span>UserID: Invalid</span>;
	}

	if (!_createBoard) {
		return <span>CreateBoard: Invalid</span>;
	}

	function onAttemptAddBoard(event) {
		event.preventDefault();

		if (!boardNameInputText || !_UserID) return;

		_createBoard(_UserID, boardNameInputText)
			.then(function () {
				console.log("Wrote Board Successfully...");
			})
			.catch(function (error) {
				console.log("Board Write Error: ", error);
			});

		setBoardNameInputText("");
		inputEl.current.value = "";
	}

	const isInvalid = boardNameInputText === "";

	return (
		<form>
			<input
				ref={inputEl}
				name="InputText_BoardName"
				onChange={(event) => {
					setBoardNameInputText(event.target.value);
				}}
				type="text"
				placeholder="MyNewBoard"
			/>

			<button disabled={isInvalid} onClick={onAttemptAddBoard}>
				Add Board
			</button>
		</form>
	);
};

const STATIC_ROUTES = [
	{
		path: "/",
		exact: true,
		link: () => (
			<li>
				<Link to="/">Home</Link>
			</li>
		),
		component: () => void 0,
	},
	{
		path: "/public",
		exact: false,
		link: () => (
			<li>
				<Link to="/public">Public</Link>
			</li>
		),
		component: (index) => (
			<Route key={index} exact={false} path="/public">
				<PublicPage />
			</Route>
		),
	},
	{
		path: "/protected",
		exact: false,
		link: () => (
			<li>
				<Link to="/protected">Protected</Link>
			</li>
		),
		component: (index) => (
			<PrivateRoute key={index} exact={false} path="/protected">
				<ProtectedPage />
			</PrivateRoute>
		),
	},
];

const UserBoards = ({
	UserID: _userId,
	UserBoards: _boardData,
	RemoveBoard: _removeBoard,
}) => {
	if (!_boardData) {
		return <span>Loading</span>;
	}
	const keys = Object.keys(_boardData);

	return (
		<ul>
			{keys.map((key) => (
				<li key={key}>
					<div>
						<Link to={`/board/${key}`}>
							<h2>Board: {_boardData[key].title}</h2>
						</Link>
						<button
							type="button"
							onClick={function (event) {
								event.preventDefault();
								_removeBoard(_userId, key);
							}}
						>
							delete
						</button>
					</div>
				</li>
			))}
		</ul>
	);
};

const Landing = () => {
	//define {authError, user, funcLogOut } with weird js object destructuring bullshit
	var { AuthAPI_Error: authError, AuthAPI_CurrentUser: user } = useAuth();

	var myUserId = user?.uid;

	const {
		BoardData: _userBoards,
		RemoveBoard: _removeBoard,
		CreateBoard: _createBoard,
	} = useBoardList(myUserId);

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
	if (user === false) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <SignIn />;
	}

	//Not logged in
	if (user === false) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <SignInForm />;
	}

	//#endregion

	return (
		<BrowserRouter>
			<div style={{ display: "flex" }}>
				<div
					style={{
						padding: "10px",
						width: "40%",
						background: "#f0f0f0",
					}}
				>
					<ul style={{ listStyleType: "none", padding: 0 }}>
						{STATIC_ROUTES.map((route, index) => (
							<route.link key={index} />
						))}
					</ul>
					<UserBoards
						UserID={myUserId}
						UserBoards={_userBoards}
						RemoveBoard={_removeBoard}
					/>
					<AddBoardForm UserID={myUserId} CreateBoard={_createBoard} />
				</div>
			</div>

			<div>
				<AuthButton />
				<Switch>
					{STATIC_ROUTES.map((route, index) => route.component(index))}
				</Switch>
			</div>

			<div>
				<Home UserID={myUserId} />

				<Route path="/board/:boardId">
					<Board UserID={myUserId} />
				</Route>
			</div>
		</BrowserRouter>
	);
};

export default Landing;

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
	var { AuthAPI_CurrentUser: user } = useAuth();

	return (
		<Route
			{...rest}
			render={({ location }) =>
				user ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
}

function PublicPage() {
	return <h3>Public</h3>;
}

function ProtectedPage() {
	return <h3>Protected</h3>;
}

function AuthButton() {
	//define {user, funcLogOut } with weird js object destructuring bullshit

	var authAPI = useAuth();

	var { AuthAPI_CurrentUser: user, AuthAPI_LogOut: funcLogOut } = authAPI;

	let history = useHistory();

	if (user === false) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <p>You are not logged in. User False</p>;
	}

	//state of loading
	if (user === null) {
		return <p>You are not logged in. User NULL</p>;
	}

	return (
		<p>
			Welcome!{" "}
			<button
				onClick={() => {
					funcLogOut().then(() => {
						history.push("/");
					});
				}}
			>
				Sign out
			</button>
		</p>
	);
}
