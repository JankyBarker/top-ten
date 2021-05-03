import React, { useState } from "react";
import { IsNetworkOnline } from "../../utils/network";
import UserProfile from "../UserProfile/UserProfile.js";
import { useAuth } from "../../context/AuthContext.js";
import useTopTen from "../../hooks/useTopTen";
import { db } from "../Firebase/fbConfig.js";
import Board from "../Board";
//import useDummyData from "../../hooks/useDummyData";

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	var { LoginAnon: funcLoginAnon, LoginEmail: funcLoginEmail } = useAuth();

	function onAttemptSignIn(event) {
		event.preventDefault();
		console.log("email is " + email);
		console.log(email);
		console.log("password is :");
		console.log(password);

		funcLoginEmail(email, password) //returns Promise
			.then(() => {
				//reset state
				setEmail("");
				setPassword("");

				//go home
				//this.props.history.push(ROUTES.HOME);
			})
			.catch((error) => {
				setError(error);
			});
	}

	const loginAnonymously = (event) => {
		event.preventDefault();
		funcLoginAnon();
	};

	const isInvalid = password === "" || email === "";

	return (
		<form>
			<input
				name="email"
				onChange={(event) => {
					setEmail(event.target.value);
				}}
				type="text"
				placeholder="Email Address"
			/>
			<input
				name="password"
				onChange={(event) => {
					setPassword(event.target.value);
				}}
				type="password"
				placeholder="Password"
			/>
			<button disabled={isInvalid} onClick={onAttemptSignIn}>
				Sign In
			</button>
			{error && <p>{error.message}</p>}

			<button onClick={loginAnonymously}>
				Continue as Guest <sup>*</sup>
			</button>
		</form>
	);
};

function AddToOrder(orderRef, newTaskId, taskList) {
	orderRef.transaction(
		function (post) {
			let postData = taskList.map((a) => a.uid);
			postData.push(newTaskId);

			//this return will set the data
			//returning undefined will abort the operation
			return postData;
		},
		function (error, committed, snapshot) {
			if (error) {
				console.log("Transaction failed abnormally!", error);
			} else if (!committed) {
				console.log("No data committed.");
			}

			console.log("AddToOrder : New data: ", snapshot.val());
		}
	);
}

function AddMovie(userId, boardId, title, taskList) {
	// console.log("SaveMovie/userId/" + userId);
	// console.log("SaveMovie/boardId/" + boardId);
	// console.log("SaveMovie/title/" + title);
	//console.log("SaveMovie/priority/ " + priority);
	//console.log("SaveMovie/description/ " + description);

	const newMovieRef = db.ref(`users/${userId}/boards/${boardId}/tasks`).push();
	const colIndex = 0; //just add the movie to the first column

	const orderRef = db.ref(
		`users/${userId}/boards/${boardId}/columns/${colIndex}/`
	);

	newMovieRef
		.set({
			movieTitle: title,
		})
		.then(function () {
			AddToOrder(orderRef, newMovieRef.key, taskList[colIndex]);
		})
		.catch(function (error) {
			console.log("Synchronization failed");
		});
}

const AddTask = ({ boardId, userId, taskList }) => {
	const addTask = (e) => {
		e.preventDefault();

		const title = e.target.elements.newTaskTitle.value;
		//const priority = e.target.elements.priority.value;

		if (!title) return;

		AddMovie(userId, boardId, title, taskList);
		e.target.elements.newTaskTitle.value = "";
	};

	return (
		<div>
			<form onSubmit={addTask} autoComplete="off">
				<h4>Add a New Task</h4>

				<div>
					<div>
						<label htmlFor="newTaskTitle">Title:</label>
						<input maxLength="45" required type="text" name="newTaskTitle" />
					</div>
				</div>

				<button>Add Task</button>
			</form>
		</div>
	);
};

const Landing = () => {
	//define {authError, user, funcLogOut } with weird js object destructuring bullshit
	var { error: authError, currentUser: user, Logout: funcLogOut } = useAuth();

	var myUserId = user?.uid;
	const boardId = 0;

	//define {state, setState } with weird js object destructuring bullshit
	const {
		ColumnData: _columns,
		SetColumnData: _setColumns,
		TaskData: _tasks /*,addItem*/,
	} = useTopTen(myUserId, boardId);

	// const {
	// 	initialData: state,
	// 	setInitialData: setState,
	// 	addItem,
	// } = useDummyData(myUserId, boardId);

	if (!_columns) {
		return <span>Loading...</span>;
	}

	if (!Array.isArray(_columns) || !Array.isArray(_columns[0])) {
		return <span>Data Type Error: Top Ten State not array format</span>;
	}

	//#region Authentication

	if (!IsNetworkOnline())
		return (
			<span>No Internet connection detected! Please connect and try again</span>
		);

	//error while logging in
	if (authError)
		return (
			<div>
				<h1>"Error"{/*authObject.error*/}</h1>
				<button

				//onClick={loginWithGoogle}
				>
					Retry Login
				</button>
			</div>
		);

	var userName = "";
	//Not logged in
	if (user === false) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <SignInForm />;
	}
	//state of loading
	if (user === null) {
		return <span>Loading</span>;
	}

	if (user.isAnonymous === true) {
		userName = "Anon";
	} else {
		userName = user.email;
	}

	//#endregion

	return (
		<div>
			<UserProfile name={userName} />
			<button onClick={funcLogOut}>Log out</button>
			<Board
				UserID={myUserId}
				BoardID={boardId}
				ColumnData={_columns}
				SetColumnData={_setColumns}
				TaskData={_tasks}
				AddGroup={() => {
					//setState([...state, []]);
				}}
				AddItem={() => {
					//setState([...state, addItem()]);
				}}
			/>
			<AddTask boardId={boardId} userId={myUserId} taskList={_columns} />
		</div>
	);
};

export default Landing;
