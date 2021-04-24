import * as React from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
const CountContext = React.createContext();
//https://kentcdodds.com/blog/how-to-use-react-context-effectively
//try using Reducer here? - see above

function AuthProvider({ children }) {
	const [users, setUsers] = React.useState([]);

	//define {AuthError, currentUser, SetCurrentUser} with weird js object destructuring bullshit
	const {
		error: AuthError,
		user: currentUser,
		setUser: SetCurrentUser,
		FireBaseLoginAnon: LoginAnon,
		FireBaseLoginEmail: LoginEmail,
		FireBaseLogOut: Logout,
	} = useFirebaseAuth();

	const CountAPI = {
		AuthError,
		users,
		setUsers,
		currentUser,
		SetCurrentUser,
		LoginAnon,
		LoginEmail,
		Logout,
	};
	return (
		<CountContext.Provider value={CountAPI}>{children}</CountContext.Provider>
	);
}

function useAuth() {
	const context = React.useContext(CountContext);
	if (context === undefined) {
		throw new Error("useCount must be used within a <CountProvider>");
	}
	return context;
}

export { AuthProvider, useAuth };
