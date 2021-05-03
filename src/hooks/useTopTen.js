import { useState, useEffect } from "react";
import { db } from "../components/Firebase/fbConfig.js";

//https://console.firebase.google.com/project/top-ten-d9fc1/database/top-ten-d9fc1-default-rtdb/data

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
					var item = { ...childSnapshot.val() };
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

	const AddItem = () => {
		return [];
	};

	return {
		ColumnData: ColumnIndexData,
		SetColumnData: setColumnIndexData,
		TaskData: RawTaskData,
		SetTaskData: SetRawTaskData,
		addItem: AddItem,
	};
};

export default useTopTen;
