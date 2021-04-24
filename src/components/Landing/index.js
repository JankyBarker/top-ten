import React, { useState, useCallback, useEffect } from "react";
import { IsNetworkOnline } from "../../utils/network";
import UserProfile from "../UserProfile/UserProfile.js";
import { useAuth } from "../../context/AuthContext.js";
import { db } from "../../components/Firebase/fbConfig.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

function RemoveMovie(movie_id, myUserId) {
	var movieRef = db.ref(`toptens/${myUserId}/${movie_id}`);

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
	var newMovieRef = db.ref(`toptens/${myUserId}`).push();

	newMovieRef.set({
		text: movieName,
		priority: 0,
	});
}

function ChangeMoviePriority(movie_id, myUserId, newPriority) {
	var movieRef = db.ref(`toptens/${myUserId}/${movie_id}`);
	movieRef
		.update({ priority: newPriority })
		.then(function () {
			console.log("Move succeeded.");
		})
		.catch(function (error) {
			console.log("Move failed: " + error.message);
		});
}

function MovieListView(props) {
	const [movies, setMovies] = useState(null);

	const { currentUser: user } = useAuth();

	const callbackRemoveMovie = useCallback(
		(movieID) => {
			RemoveMovie(movieID, user.uid);
		},
		[user]
	);

	const addMovie = (e) => {
		e.preventDefault();
		const newMovieName = e.target.elements.movieName.value;
		SaveMovie(newMovieName, user.uid);
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
		ChangeMoviePriority(sourceItem.uid, user.uid, destOrder);
		ChangeMoviePriority(destItem.uid, user.uid, sourceOrder);
	};

	var myUserId = user.uid;

	useEffect(() => {
		var topUserPostsRef = db
			.ref(`toptens/${myUserId}`)
			.orderByChild("priority");

		return topUserPostsRef.on("value", (snap) => {
			const documents = [];

			if (snap !== undefined) {
				snap.forEach((childSnapshot) => {
					var item = { ...childSnapshot.val() };
					item.uid = childSnapshot.key;
					documents.push(item);
				});
			}

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

const Landing = () => {
	//var { user } = useContext(UserContext);

	//define {authError, user, funcLogOut } with weird js object destructuring bullshit
	var { error: authError, currentUser: user, Logout: funcLogOut } = useAuth();

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
					className="bg-blue-600 text-3xl px-2 py-1"
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

	return (
		<div>
			<UserProfile name={userName} />
			<button onClick={funcLogOut}>Log out</button>
			<MovieListView />
		</div>
	);
};

export default Landing;
