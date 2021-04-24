import React, { useState, useEffect } from "react";

//import useFirebaseAuth from "../../hooks/useFirebaseAuth";

import ThemeContextProvider from "../../context/ThemeContext";
//import UserContextProvider from "../../context/UserContext";
//import { UserContext } from "../../context/UserContext";
import { CountProvider, useCount } from "../../context/CountContext";

import { useHotkeys } from "react-hotkeys-hook";

//import Landing from "../Landing";

export const TimerComponent = () => {
	const [timeCurrent, setTimeLeft] = useState(0);

	useEffect(() => {
		const funcTimer = setTimeout(() => {
			setTimeLeft(timeCurrent + 1);
		}, 1000);

		// Clear timeout if the component is unmounted
		return () => clearTimeout(funcTimer);
	});

	return <div>{<span>Count: {timeCurrent}</span>}</div>;
};

const ExampleKeyComponent = () => {
	const [count] = useState(0);

	const { /*users: userList,*/ setUsers: funcSetUsers } = useCount();

	useHotkeys("k", () =>
		//prevList is react passing use the previous state
		funcSetUsers((prevList) => [...prevList, "hellow", "world"])
	);

	return <p>Pressed {count} times.</p>;
};

const UserListComponent = () => {
	// get the current value in UsersContext through the hook
	//const themeContext = useContext(ThemeContext);
	//const { users } = themeContext;

	const { users: userList } = useCount();

	console.log("UserListComponent:" + userList);

	const listItems = userList.map((item, i) => {
		return <li key={i}>{item}</li>;
	});

	return <div>{listItems}</div>;
};

function ResetButton() {
	//define {setValue} with weird js object destructuring bullshit
	const { setUsers: setValue } = useCount();

	return <button onClick={() => setValue([])}>Reset User List</button>;
}

function App() {
	//const [user] = useFirebaseAuth();

	return (
		<div className="App">
			{/* <UserContext.Provider value={{ user }}> */}
			<CountProvider>
				<ThemeContextProvider>
					<ResetButton />
					<UserListComponent />
					<TimerComponent />
					<ExampleKeyComponent />
					{/* <Landing /> */}
				</ThemeContextProvider>
			</CountProvider>
			{/* </UserContext.Provider> */}
		</div>
	);
}

export default App;
