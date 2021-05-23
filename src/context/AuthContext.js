import * as React from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
const CountContext = React.createContext();
//https://kentcdodds.com/blog/how-to-use-react-context-effectively
//try using Reducer here? - see above

function AuthProvider({ children }) {
	const AuthAPI = useFirebaseAuth();
	return (
		<CountContext.Provider value={AuthAPI}>{children}</CountContext.Provider>
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
