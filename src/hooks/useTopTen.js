import { useState, useEffect } from "react";
import { db } from "../components/Firebase/fbConfig.js";

//https://console.firebase.google.com/project/top-ten-d9fc1/database/top-ten-d9fc1-default-rtdb/data

function RemoveFromTaskColumnOrder(orderRef, removeTaskId, taskList, taskRef) {
	//check arguments
	if (!orderRef) {
		console.log(
			"UseTopTen: RemoveMovie: Invalid Firebase Database Column Reference"
		);
		return;
	}

	if (!taskRef) {
		console.log(
			"UseTopTen: RemoveMovie: Invalid Firebase Database Task Reference"
		);
		return;
	}

	orderRef
		.transaction(
			function (post) {
				let newArray = taskList.filter(function (ele) {
					return ele.uid !== removeTaskId;
				});

				let postData = newArray.map((a) => a.uid);

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

				console.log("RemoveFromTaskColumnOrder : New data: ", snapshot.val());
			}
		)
		.then(function () {
			//then->delete Task from Databse JSON
			console.log("now delete the task");
			taskRef.remove();
		})
		.catch(function (error) {
			console.log("Synchronization failed");
		});
}

function RemoveMovie(orderRef, removeTaskId, taskList, taskRef) {
	//transaction to remove movie from order list
	RemoveFromTaskColumnOrder(orderRef, removeTaskId, taskList, taskRef);
}

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
			console.log("Synchronization failed: " + error);
		});
}

const useTopTen = (userId, boardId) => {
	const [RawTaskData, SetRawTaskData] = useState(null);
	const [ColumnIndexData, setColumnIndexData] = useState(null);

	const colIndex = 0; //just use first column for now

	useEffect(() => {
		if (!userId) return null;

		// var tasksTableRef = db
		// 	.ref(`users/${userId}/boards/${boardId}/tasks`)
		// 	.orderByChild("priority");

		const ColumnIndexRefString = `users/${userId}/boards/${boardId}/columns/${colIndex}/`;

		const ColumnIndexRef = db.ref(ColumnIndexRefString);

		return ColumnIndexRef.on("value", (snap) => {
			const documents = [];

			if (snap !== undefined) {
				if (snap.val() === null) {
					console.log(
						"%c Error: " + ColumnIndexRefString + " - Not found",
						"background: #2f8078"
					);
				}
				snap.forEach((childSnapshot) => {
					var item = {};
					item.uid = childSnapshot.val();
					documents.push(item);
				});
			}

			setColumnIndexData([documents]);
		});
	}, [userId, boardId]);

	useEffect(() => {
		if (!userId) return null;

		const tasksTableRefString = `users/${userId}/boards/${boardId}/tasks`;
		var tasksTableRef = db.ref(tasksTableRefString);

		return tasksTableRef.on("value", (snap) => {
			if (snap !== undefined) {
				if (snap.val() === null) {
					console.log(
						"%c Error: " + tasksTableRefString + " - Not found",
						"background: #2f8078"
					);
				}

				SetRawTaskData(snap.val());
			}
		});
	}, [userId, boardId]);

	function addMovie(_movieName) {
		console.log("SaveMovie/userId/" + userId);
		console.log("SaveMovie/boardId/" + boardId);
		console.log("SaveMovie/title/" + _movieName);
		AddMovie(userId, boardId, _movieName, ColumnIndexData);
	}

	function deleteTask(_taskID) {
		console.log("Deleting.. " + _taskID);

		if (!_taskID) {
			console.log("DeleteTask: Invalid ID");
			return;
		}

		const ColumnIndexRefString = `users/${userId}/boards/${boardId}/columns/${colIndex}/`;
		const ColumnIndexRef = db.ref(ColumnIndexRefString);

		const oldTaskRef = db.ref(
			`users/${userId}/boards/${boardId}/tasks/${_taskID}`
		);

		RemoveMovie(ColumnIndexRef, _taskID, ColumnIndexData[colIndex], oldTaskRef);
	}

	return {
		ColumnData: ColumnIndexData,
		SetColumnData: setColumnIndexData,
		TaskData: RawTaskData,
		SetTaskData: SetRawTaskData,
		AddMovie: addMovie,
		RemoveTask: deleteTask,
	};
};

export default useTopTen;
