import React, { useState } from "react";
import useFirebaseAuth, { AuthComponent } from "../../hooks/useFirebaseAuth";

import ThemeContextProvider from "../../context/ThemeContext";
//import UserContextProvider from "../../context/UserContext";
import { UserContext } from "../../context/UserContext";

import { useHotkeys } from "react-hotkeys-hook";

import Landing from "../Landing";

const ExampleKeyComponent = () => {
	const [count, setCount] = useState(0);
	useHotkeys("k", () => setCount((prevCount) => prevCount + 1));

	return <p>Pressed {count} times.</p>;
};

function App() {
	const [user] = useFirebaseAuth();

	return (
		<div className="App">
			<UserContext.Provider value={{ user }}>
				<ThemeContextProvider>
					<ExampleKeyComponent />
					<Landing />
					<AuthComponent />
				</ThemeContextProvider>
			</UserContext.Provider>
		</div>
	);
}

export default App;
