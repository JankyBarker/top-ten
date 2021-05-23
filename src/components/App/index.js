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

// const UserListComponent = () => {
// 	//define {userList} with weird js object destructuring bullshit
// 	const { users: userList } = useAuth();

// 	const listItems = userList.map((item, i) => {
// 		return <li key={i}>{item}</li>;
// 	});

// 	return <div>{listItems}</div>;
// };

// function ResetButton() {
// 	//define {setValue} with weird js object destructuring bullshit
// 	const { setUsers: setValue } = useAuth();

// 	return <button onClick={() => setValue([])}>Reset User List</button>;
// }

function App() {
	return (
		<div className="App">
			<AuthProvider>
				{/* <ResetButton /> */}
				{/* <UserListComponent /> */}
				{/* <TimerComponent /> */}
				{/* <ExampleKeyComponent /> */}
				<Landing />
			</AuthProvider>
		</div>
	);
}

export default App;
