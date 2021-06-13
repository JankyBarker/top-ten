import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useHistory, Link } from "react-router-dom";
import "skeleton-css/css/normalize.css";
import "skeleton-css/css/skeleton.css";
import "./style.css";
import { ReactComponent as TrashIcon } from "../../assets/trash.svg";
import useBoardList from "../../hooks/useBoardList";

function AddBoardForm({ UserID: _UserID, CreateBoard: _createBoard }) {
	const [boardNameInputText, setBoardNameInputText] = useState("");
	const inputEl = useRef(null);

	if (!_UserID) {
		return <span>UserID: Invalid</span>;
	}

	if (!_createBoard) {
		return <span>CreateBoard: Invalid</span>;
	}

	function onAttemptAddBoard(event) {
		event.preventDefault();

		if (!boardNameInputText || !_UserID) return;

		_createBoard(_UserID, boardNameInputText)
			.then(function () {
				console.log("Wrote Board Successfully...");
			})
			.catch(function (error) {
				console.log("Board Write Error: ", error);
			});

		setBoardNameInputText("");
		inputEl.current.value = "";
	}

	const isInvalid = boardNameInputText === "";

	return (
		<form>
			<input
				ref={inputEl}
				name="InputText_BoardName"
				onChange={(event) => {
					setBoardNameInputText(event.target.value);
				}}
				type="text"
				placeholder="MyNewBoard"
			/>

			<button disabled={isInvalid} onClick={onAttemptAddBoard}>
				Add Board
			</button>
		</form>
	);
}

function UserBoards({
	UserID: _userId,
	UserBoards: _boardData,
	RemoveBoard: _removeBoard,
}) {
	// eslint-disable-next-line
	const keys = Object.keys(_boardData);

	return (
		<div className="boardContent">
			<div className="boardContainer">
				{keys.map((key) => (
					<div class="boardBox" key={key}>
						<div class="boardBoxContents">
							{/* <h2 class="boardText">HELLO WORLD</h2> */}
							<Link to={`/board/${key}`}>{_boardData[key].title}</Link>

							<div
								class="TrashIcon"
								onClick={function (event) {
									event.preventDefault();
									_removeBoard(_userId, key);
								}}
							>
								<TrashIcon />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function BoardList() {
	var { AuthAPI_CurrentUser: user } = useAuth();

	var _userId = user?.uid;

	const {
		BoardData: _userBoards,
		RemoveBoard: _removeBoard,
		CreateBoard: _createBoard,
	} = useBoardList(_userId);

	if (null === _userBoards) {
		return <span>Loading Boards...</span>;
	}

	return (
		<div className="PagePadding">
			<AddBoardForm UserID={_userId} CreateBoard={_createBoard} />
			<div className="PageColumn">
				<AuthHeader />
				<UserBoards
					UserID={_userId}
					UserBoards={_userBoards}
					RemoveBoard={_removeBoard}
				/>
			</div>
		</div>
	);
}

function AuthHeader() {
	var authAPI = useAuth();

	//define {user, funcLogOut } with weird js object destructuring bullshit
	var { AuthAPI_CurrentUser: user, AuthAPI_LogOut: funcLogOut } = authAPI;

	let history = useHistory();

	if (user === false) {
		// return <SignIn loginWithGoogle={null} signInAnon={null} />;
		return <p>You are not logged in. User False</p>;
	}

	//state of loading
	if (user === null) {
		return <p>You are not logged in. User NULL</p>;
	}

	return (
		<div className="header">
			<h3 className="headerText">Welcome,Stranger</h3>
			<button
				onClick={() => {
					funcLogOut().then(() => {
						history.push("/");
					});
				}}
			>
				Sign out
			</button>
		</div>
	);
}

export default BoardList;
