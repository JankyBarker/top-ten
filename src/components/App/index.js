import React /*,{ useState, useEffect }*/ from "react";
import { AuthProvider /*, useAuth*/ } from "../../context/AuthContext";
//import { useHotkeys } from "react-hotkeys-hook";
import Landing from "../Landing";

//https://reactrouter.com/web/example/auth-workflow

// export const TimerComponent = () => {
// 	const [timeCurrent, setTimeLeft] = useState(0);

// 	useEffect(() => {
// 		const funcTimer = setTimeout(() => {
// 			setTimeLeft(timeCurrent + 1);
// 		}, 1000);

// 		// Clear timeout if the component is unmounted
// 		return () => clearTimeout(funcTimer);
// 	});

// 	return <div>{<span>Count: {timeCurrent}</span>}</div>;
// };

// const ExampleKeyComponent = () => {
// 	const [count] = useState(0);

// 	const { /*users: userList,*/ setUsers: funcSetUsers } = useAuth();

// 	useHotkeys("k", () =>
// 		//prevList is react passing use the previous state
// 		funcSetUsers((prevList) => [...prevList, "hellow", "world"])
// 	);

// 	return <p>Pressed {count} times.</p>;
// };

function App() {
	return (
		<AuthProvider>
			{/* <TimerComponent /> */}
			{/* <ExampleKeyComponent /> */}
			<Landing />
		</AuthProvider>
	);
}

export default App;
