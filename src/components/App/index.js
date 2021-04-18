import React, { useState, useContext } from "react";
import useFirebaseAuth, { AuthComponent } from "../../hooks/useFirebaseAuth";

import ThemeContextProvider from "../../context/ThemeContext";
//import UserContextProvider from "../../context/UserContext";
import { UserContext } from "../../context/UserContext";

import { useHotkeys } from "react-hotkeys-hook";

import SignIn from "../SignIn";
import Landing from "../Landing";

const ExampleComponent = () => {
	const [count, setCount] = useState(0);
	useHotkeys("k", () => setCount((prevCount) => prevCount + 1));

	return <p>Pressed {count} times.</p>;
};

function UserProfile() {
	const { user } = useContext(UserContext);
	//const user = { displayName: "debug" }; //useSession()

	if (user && user.isAnonymous === true) return <div>Hello, Anon</div>;

	return <div>Hello, {user ? user.email : "No Login"}</div>;
}

function App() {
	const [user] = useFirebaseAuth();

	if (navigator.onLine !== true) {
		return (
			<span>No Internet connection detected! Please connect and try again</span>
		);
	}

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

	//Not logged in
	if (user === false) {
		return <SignIn loginWithGoogle={null} signInAnon={null} />;
	}
	//state of loading
	if (user === null) {
		<span>Loading</span>;
	}

	return (
		<div className="App">
			<UserContext.Provider value={{ user }}>
				<ThemeContextProvider>
					<ExampleComponent />
					<UserProfile />
					<Landing />
					<AuthComponent />
				</ThemeContextProvider>
			</UserContext.Provider>
		</div>
	);
}

export default App;
