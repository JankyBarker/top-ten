import { useState, useEffect } from "react";
import { db } from "../components/Firebase/fbConfig.js";
//import { v4 as uuidv4 } from "uuid";

//https://console.firebase.google.com/project/top-ten-d9fc1/database/top-ten-d9fc1-default-rtdb/data

function SaveOrder(orderRef, taskList) {
	if (!taskList) {
		console.log(
			"UseTopTen: AddToOrder: Invalid Firebase Database Task List Data"
		);
		return;
	}

	if (!orderRef) {
		console.log(
			"UseTopTen: AddToOrder: Invalid Firebase Database Column Reference"
		);
		return;
	}

	orderRef.transaction(
		function (post) {
			let postData = taskList.map((a) => a.uid);

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

			//console.log("AddToOrder : New data: ", snapshot.val());
		}
	);
}

function AddMovie(newMovieRef, orderRef, title, taskList) {
	if (!newMovieRef) {
		console.log("useTopTen/AddMovie: Database New Reference is invalid");
		return;
	}

	if (!orderRef) {
		console.log("useTopTen/AddMovie: Order Database Reference is invalid");
		return;
	}

	newMovieRef
		.set({
			movieTitle: title,
		})
		.then(function () {
			taskList.push({ uid: newMovieRef.key });
			SaveOrder(orderRef, taskList);
		})
		.catch(function (error) {
			console.log("Synchronization failed: " + error);
		});
}

const useTopTen = (userId, boardId) => {
	const [RawTaskData, SetRawTaskData] = useState(null);
	const [ColumnIndexData, setColumnIndexData] = useState(null);

	useEffect(() => {
		if (!userId) return null;

		const dbRefString = `/boards/${boardId}/columns/`;
		const ColumnsIndexRef = db.ref(dbRefString);

		return ColumnsIndexRef.on("value", (dbColumnsIndexSnap) => {
			if (!dbColumnsIndexSnap) return null;

			const columnIndices = [];

			if (dbColumnsIndexSnap.exists() && dbColumnsIndexSnap.val()) {
				let dbValue = dbColumnsIndexSnap.val();

				//0: ["-M_CVm-J9tnNX-2peD4Y", "-M_CXCFnp05GNxoDhRLB", "-M_CXCkXKxYe_WF_Pxi2"]
				//1: ["-M_CYEaZilSmamVqGg1K"]

				dbValue.forEach((it, index) => {
					//0: ["-M_CVm-J9tnNX-2peD4Y", "-M_CXCFnp05GNxoDhRLB", "-M_CXCkXKxYe_WF_Pxi2"]
					var columnTaskIds = [];
					it.forEach((childIt) => {
						var item = {};
						item.uid = childIt;
						columnTaskIds.push(item);
					});

					//ensure the array is overriden to prevent zombie items
					columnIndices[index] = columnTaskIds;
				});
			} else {
				console.log(
					"%c Error: " + dbRefString + " - Not found",
					"background: #2f8078"
				);
			}

			setColumnIndexData(columnIndices);
		});
	}, [userId, boardId]);

	useEffect(() => {
		if (!userId) return null;

		const tasksTableRefString = `/boards/${boardId}/tasks`;
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

	function addMovie(_movieName, _colIndex) {
		if (_colIndex === null || _colIndex === undefined) {
			console.log("useTopTen/addMovie/Invalid Column Index ");
			return;
		}

		const newMovieRef = db.ref(`/boards/${boardId}/tasks`).push();

		const orderRef = db.ref(`/boards/${boardId}/columns/${_colIndex}/`);

		const stateClone = Array.from(ColumnIndexData);

		AddMovie(newMovieRef, orderRef, _movieName, stateClone[_colIndex]);
	}

	function addGroup(_groupName) {
		if (_groupName.length < 1) return;

		const stateClone = Array.from(ColumnIndexData);

		//must add a non-empty object array as firebase ignores them when you try to save them
		stateClone.push([{ uid: 0 }]);

		setColumnIndexData(stateClone);

		postTaskOrder(stateClone, stateClone.length);
	}

	function deleteTask(_taskID) {
		if (_taskID === undefined || _taskID === null) {
			console.log("DeleteTask: Invalid ID");
			return;
		}
		//alert("here: " + _taskID);

		const stateClone = Array.from(ColumnIndexData);

		stateClone.forEach((it, _columnIndex) => {
			stateClone[_columnIndex] = it.filter(function (ele) {
				return ele.uid !== _taskID;
			});

			const orderRef = db.ref(`/boards/${boardId}/columns/${_columnIndex}/`);
			const oldTaskRef = db.ref(`/boards/${boardId}/tasks/${_taskID}`);

			orderRef
				.transaction(
					function (post) {
						let postData = stateClone[_columnIndex].map((a) => a.uid);

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

						console.log("Delete task : New data: ", snapshot.val());
					}
				)
				.then(function () {
					//delete Task from Database JSON
					oldTaskRef.remove();
				})
				.catch(function (error) {
					console.log("Synchronization failed");
				});
		});
	}

	function postTaskOrder(_columnArray, _arrLen) {
		setColumnIndexData(_columnArray);

		let updates = {};

		for (let i = 0; i < _arrLen; i++) {
			let column = _columnArray[i];

			let postData = column ? column.map((a) => a.uid) : null;

			updates[`/boards/${boardId}/columns/${i}/`] = postData;
		}

		//console.table(updates);

		db.ref()
			.update(updates)
			.then(function () {
				//console.log("Update Succeeded.");
			})
			.catch(function (error) {
				console.log("Update Failed: " + error.message);
			});
	}

	function deleteColumn(_columnIndex) {
		if (_columnIndex === undefined || _columnIndex === null) {
			console.log("DeleteTask: Invalid _columnIndex");
			return;
		}

		const stateClone = Array.from(ColumnIndexData);

		const numCols = stateClone.length;
		let removedColumn = stateClone.splice(_columnIndex, 1);

		let removalRefs = [];
		removedColumn.forEach((it) => {
			it.forEach((subIt) => {
				let taskRefToDelete = db.ref(`/boards/${boardId}/tasks/${subIt.uid}`);
				removalRefs.push(taskRefToDelete);
			});
		});

		let updates = {};

		for (let i = 0; i < numCols; i++) {
			let column = stateClone[i];

			let postData = column ? column.map((a) => a.uid) : null;

			updates[`/boards/${boardId}/columns/${i}/`] = postData;
		}

		// console.table(updates);

		db.ref()
			.update(updates)
			.then(function () {
				//console.log("Update Succeeded.");
				removalRefs.forEach((iterator) => {
					let ref = iterator;
					console.log("removing: " + ref);
					ref.remove();
				});
			})
			.catch(function (error) {
				console.log("Update Failed: " + error.message);
			});
	}

	return {
		ColumnData: ColumnIndexData,
		TaskData: RawTaskData,
		AddMovie: addMovie,
		AddGroup: addGroup,
		RemoveTask: deleteTask,
		UpdateTaskOrder: postTaskOrder,
		RemoveColumn: deleteColumn,
	};
};

export default useTopTen;
