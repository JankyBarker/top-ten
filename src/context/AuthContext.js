import * as React from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
const AuthContext = React.createContext();
//https://kentcdodds.com/blog/how-to-use-react-context-effectively
//try using Reducer here? - see above

function AuthProvider({ children }) {
	const AuthAPI = useFirebaseAuth();
	return (
		<AuthContext.Provider value={AuthAPI}>{children}</AuthContext.Provider>
	);
}

function useAuth() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useCount must be used within a <AuthContext.Provider>");
	}
	return context;
}

export { AuthProvider, useAuth };
