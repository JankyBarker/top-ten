import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Account.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const fbconfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

//firebase.initializeApp(fbconfig);

const defaultUser = { loggedIn: false, email: "" };
const UserContext = React.createContext(defaultUser);
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
	return firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			callback({ loggedIn: true, CurrentUser: user });
		} else {
			callback({ loggedIn: false });
		}
	});
}

function RemoveMovie(movie_id, myUserId) {
	var movieRef = firebase.database().ref(`toptens/${myUserId}/${movie_id}`);

	movieRef
		.remove()
		.then(function () {
			console.log("Remove succeeded.");
		})
		.catch(function (error) {
			console.log("Remove failed: " + error.message);
		});
}

function SaveMovie(movieName, myUserId) {
	var newMovieRef = firebase.database().ref(`toptens/${myUserId}`).push();

	newMovieRef.set({
		text: movieName,
		priority: 0,
	});
}

function ChangeMoviePriority(movie_id, myUserId, newPriority) {
	var movieRef = firebase.database().ref(`toptens/${myUserId}/${movie_id}`);
	movieRef
		.update({ priority: newPriority })
		.then(function () {
			console.log("Move succeeded.");
		})
		.catch(function (error) {
			console.log("Move failed: " + error.message);
		});
}

function login(username, password) {
	return new Promise((resolve, reject) => {
		firebase
			.auth()
			.signInWithEmailAndPassword(username, password)
			.then(() => resolve())
			.catch((error) => reject(error));
	});
}
function logout() {
	firebase.auth().signOut();
}
function LoginView({ onClick, error }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	return (
		<div>
			<input
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
			<input
				type="password"
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<button
				onClick={() => {
					onClick(username, password);
				}}
			>
				Login
			</button>
			<span>{error}</span>
		</div>
	);
}

function LogoutView({ onClick }) {
	const user = useContext(UserContext);
	return (
		<div>
			<span>You are logged in as {user.CurrentUser.email}</span>
			<button onClick={onClick}>Logout</button>
		</div>
	);
}

function MovieListView(props) {
	const [movies, setMovies] = useState(null);

	const user = useContext(UserContext);

	const callbackRemoveMovie = useCallback(
		(movieID) => {
			RemoveMovie(movieID, user.CurrentUser.uid);
		},
		[user]
	);

	const addMovie = (e) => {
		e.preventDefault();
		const newMovieName = e.target.elements.movieName.value;
		SaveMovie(newMovieName, user.CurrentUser.uid);
		e.target.elements.movieName.value = "";
	};

	const handleOnDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(movies);

		const sourceItem = items[result.source.index];
		const destItem = items[result.destination.index];

		const sourceOrder = sourceItem.priority;
		const destOrder = destItem.priority;

		//todo- move into one update call
		ChangeMoviePriority(sourceItem.uid, user.CurrentUser.uid, destOrder);
		ChangeMoviePriority(destItem.uid, user.CurrentUser.uid, sourceOrder);
	};

	var myUserId = user.CurrentUser.uid;

	useEffect(() => {
		var topUserPostsRef = firebase
			.database()
			.ref(`toptens/${myUserId}`)
			.orderByChild("priority");

		return topUserPostsRef.on("value", (snap) => {
			const documents = [];

			snap.forEach((childSnapshot) => {
				var item = { ...childSnapshot.val() };
				item.uid = childSnapshot.key;
				documents.push(item);
			});

			setMovies(documents);
		});
	}, [myUserId]);

	if (movies === null) return <span>No movies yet!</span>;
	else
		return (
			<div className="App">
				<header className="App-header">
					<h1>My Top Ten</h1>
					<form onSubmit={addMovie} autoComplete="off">
						<input
							maxLength="20"
							name="movieName"
							type="text"
							placeholder="Name of movie?"
						/>

						<button type="submit">Save</button>
					</form>
					<DragDropContext onDragEnd={handleOnDragEnd}>
						<Droppable droppableId="characters">
							{(provided) => (
								<ul
									className="characters"
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{movies.map((movie, i) => {
										return (
											<Draggable
												key={movie.uid}
												draggableId={movie.uid}
												index={i}
											>
												{(provided) => (
													<li
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<div>
															<span>Movie: {movie.text} </span>
															<button
																onClick={() => {
																	callbackRemoveMovie(movie.uid);
																}}
															>
																Delete Row
															</button>
														</div>
													</li>
												)}
											</Draggable>
										);
									})}
									{provided.placeholder}
								</ul>
							)}
						</Droppable>
					</DragDropContext>
				</header>
			</div>
		);
}

function Account() {
	const [user, setUser] = useState({ loggedIn: false });
	const [error, setError] = useState("");

	useEffect(() => {
		const unsubscribe = onAuthStateChange(setUser);
		return () => {
			unsubscribe();
		};
	}, [setUser]);

	const requestLogin = useCallback((username, password) => {
		login(username, password).catch((error) => setError(error.code));
	}, []);
	const requestLogout = useCallback(() => {
		logout();
	}, []);
	if (!user.loggedIn) {
		return <LoginView onClick={requestLogin} error={error} />;
	}

	return (
		<UserProvider value={user}>
			<LogoutView onClick={requestLogout} />
			<MovieListView />
		</UserProvider>
	);
}

export default Account;
