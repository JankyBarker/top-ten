import { createContext } from "react";

export const UserContext = createContext(null);

/*
const UserContextProvider = (props) => {
	return (
		<UserContext.Provider value={fbUser}>{props.children}</UserContext.Provider>
	);
};

export default UserContextProvider;
*/
