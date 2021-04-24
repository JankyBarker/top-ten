import React, { createContext, useState } from "react";

export const ThemeContext = createContext({});

const ThemeContextProvider = (props) => {
	// Use State to keep the values
	const [users, setUsers] = useState(["yo", "mama"]);

	//console.log("ThemeContextProvider: Construct");

	const [selectedUser, setSelectedUser] = useState({});

	const addNewUser = (userName) => {
		let oldUsers = [...users];

		console.log("before:" + oldUsers);

		//setting a new array to prevent React seeing the array as the same using shallow equality.
		setUsers([...users, userName]);

		console.log("after:" + users);
	};

	// Make the context object:
	const usersContext = {
		users,
		setUsers,
		selectedUser,
		setSelectedUser,
		addNewUser,
	};

	return (
		<ThemeContext.Provider value={usersContext}>
			{props.children}
		</ThemeContext.Provider>
	);
};

export default ThemeContextProvider;
