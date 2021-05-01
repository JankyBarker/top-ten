import React, { useState } from "react";
import { IsNetworkOnline } from "../../utils/network";
import UserProfile from "../UserProfile/UserProfile.js";
import { useAuth } from "../../context/AuthContext.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useTopTen from "../../hooks/useTopTen";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Firebase/fbConfig.js";
import Board from "../Board";
//import useDummyData from "../../hooks/useDummyData";

const TYPENAME_TASK = "task";

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

function SaveMovie(userId, boardId, title) {
	console.log("SaveMovie/userId/" + userId);
	console.log("SaveMovie/boardId/" + boardId);
	console.log("SaveMovie/title/" + title);
	//console.log("SaveMovie/priority/ " + priority);
	//console.log("SaveMovie/description/ " + description);

	var newMovieRef = db.ref(`users/${userId}/boards/${boardId}/tasks`).push();

	newMovieRef.set({
		movieTitle: title,
		priority: 0,
	});
}

const AddTask = ({ boardId, userId, close }) => {
	const addTask = (e) => {
		e.preventDefault();

		const title = e.target.elements.newTaskTitle.value;
		//const priority = e.target.elements.priority.value;

		if (!title) return;

		SaveMovie(userId, boardId, title);
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

					{/* <div>
						<div>
							<label htmlFor="priority">Priority: </label>
							<select name="priority" defaultValue="low" className="select">
								<option value="high">High</option>
								<option value="medium">Medium</option>
								<option value="low">Low</option>
							</select>
						</div>
					</div> */}
				</div>

				{/* <div>
					<label htmlFor="newTaskDescription">Description (optional):</label>
					<textarea
						name="desc"
						defaultValue={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div> */}

				<button>Add Task</button>
			</form>
		</div>
	);
};

const Task = ({ taskData, index }) => {
	return (
		<div>
			<Draggable key={taskData.uid} draggableId={taskData.uid} index={index}>
				{(provided, snapshot) => (
					<div
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
					>
						<div>
							<h4>{taskData.movieTitle}</h4>
						</div>
					</div>
				)}
			</Draggable>
		</div>
	);
};

const Column = ({
	column,
	tasks,
	allData,
	boardId,
	userId,
	filterBy,
	index,
}) => {
	return (
		<>
			<Draggable draggableId={column.id} index={index} key={column.id}>
				{(provided) => (
					<div {...provided.draggableProps} ref={provided.innerRef}>
						<div>
							<div {...provided.dragHandleProps}></div>
							<Droppable
								key={column.id}
								droppableId={column.id}
								type={TYPENAME_TASK}
							>
								{(provided) => (
									<div {...provided.droppableProps} ref={provided.innerRef}>
										{tasks?.map((t, i) => (
											<Task taskData={t} index={i} />
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					</div>
				)}
			</Draggable>
		</>
	);
};

function MovieListView(props) {
	const boardId = 0;

	const { currentUser: user } = useAuth();

	var myUserId = user.uid;

	const { initialData } = useTopTen(myUserId, boardId);

	const handleOnDragEnd = (result) => {
		if (result.type === TYPENAME_TASK) {
			console.log("drag task");
			return;
		}

		console.log("drag column");
	};

	if (!initialData || !initialData.tasks) {
		return <span>Data Error</span>;
	}

	if (typeof initialData !== "object") {
		return <span>Data Type Error: : InitialData not an object</span>;
	}

	if (!Array.isArray(initialData.tasks)) {
		return <span>Data Type Error: InitialData.tasks not array</span>;
	}

	const tasks = initialData.tasks.map((t) => t);

	const uid = uuidv4();

	const column = { id: uid };

	return (
		<div className="App">
			<header className="App-header">
				<h1>My Top Ten</h1>
				<AddTask
					boardId={boardId}
					userId={myUserId}
					allCols={initialData.columnOrder}
				/>

				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable
						key="allCols"
						droppableId="allCols"
						type="column"
						direction="horizontal"
					>
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								<Column
									column={column}
									tasks={tasks}
									allData={initialData}
									key={uid}
									boardId={boardId}
									userId={myUserId}
									index={0}
								/>
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</header>
		</div>
	);
}

const Landing = () => {
	//define {authError, user, funcLogOut } with weird js object destructuring bullshit
	var { error: authError, currentUser: user, Logout: funcLogOut } = useAuth();

	var myUserId = user?.uid;
	const boardId = 0;

	//define {state, setState } with weird js object destructuring bullshit
	const { initialData: state, setInitialData: setState, addItem } = useTopTen(
		myUserId,
		boardId
	);

	// const {
	// 	initialData: state,
	// 	setInitialData: setState,
	// 	addItem,
	// } = useDummyData(myUserId, boardId);

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
			{false ? <MovieListView /> : null}
			<Board
				UserID={myUserId}
				BoardID={boardId}
				state={state} //removed dependency on data structure
				setState={setState}
				AddGroup={() => {
					setState([...state, []]);
				}}
				AddItem={() => {
					setState([...state, addItem()]);
				}}
			/>
		</div>
	);
};

export default Landing;
