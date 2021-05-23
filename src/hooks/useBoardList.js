import { useState, useEffect } from "react";
import { db } from "../components/Firebase/fbConfig.js";

//https://console.firebase.google.com/project/top-ten-d9fc1/database/top-ten-d9fc1-default-rtdb/data

function DeleteBoard(_uid_creator, _boardKey) {
	if (!_uid_creator)
		return Promise.reject(
			"uid_creator is invalid: uid_creator = " + _uid_creator
		);

	if (!_boardKey)
		return Promise.reject("title is invalid: title = " + _boardKey);

	const boardRef = db.ref(`/boards/${_boardKey}`);
	const userBoardRef = db.ref(`/user-boards/${_uid_creator}/${_boardKey}`);

	userBoardRef
		.transaction(
			function (post) {
				//this return will set the data
				//returning undefined will abort the operation
				return null;
			},
			function (error, committed, snapshot) {
				if (error) {
					console.log("Transaction failed abnormally!", error);
				} else if (!committed) {
					console.log("No data committed.");
				}

				console.log("Delete Board : New data: ", snapshot.val());
			}
		)
		.then(function () {
			//delete Board Information from
			return boardRef.remove();
		})
		.catch(function (error) {
			return Promise.reject("Board Delete Synchronization failed");
		});
}

function WriteNewBoard(_uid_creator, _boardName) {
	if (!_uid_creator)
		return Promise.reject(
			"uid_creator is invalid: uid_creator = " + _uid_creator
		);
	if (!_boardName)
		return Promise.reject("title is invalid: title = " + _boardName);

	// A post entry.
	var postData = {
		uid: _uid_creator,
		title: _boardName,
		// starCount: 0,
	};

	// Get a key for a new Board.
	var newBoardKey = db.ref().child("boards").push().key;

	// Write the new Board's data simultaneously in the posts list and the user's Board list.
	var updates = {};
	updates["/boards/" + newBoardKey] = postData;
	updates["/user-boards/" + _uid_creator + "/" + newBoardKey] = postData;

	return db.ref().update(updates);
}

const useBoardList = (userId) => {
	const [rawBoardData, SetRawBoardData] = useState(null);

	useEffect(() => {
		if (!userId) {
			SetRawBoardData(null);
			return null;
		}

		// "boards":{

		//   "board_id_one":{
		//      "boardName":"Historical Tech Pioneers",
		//      "timestamp":1459361875666
		//   },
		//   "board_id_two":{
		//      "boardName":"Historical Tech Pioneers",
		//      "timestamp":1459361875666

		const dbRefString = `user-boards/` + userId;
		const tasksTableRef = db.ref(dbRefString);

		return tasksTableRef.on("value", (snap) => {
			if (snap !== undefined) {
				if (snap.val() === null) {
					console.log(
						"%c Error: " + dbRefString + " - Not found",
						"background: #2f8078"
					);
				}

				SetRawBoardData(snap.val());
			}
		});
	}, [userId]);

	return {
		BoardData: rawBoardData,
		SetBoardData: SetRawBoardData,
		RemoveBoard: DeleteBoard,
		CreateBoard: WriteNewBoard,
	};
};

export default useBoardList;
