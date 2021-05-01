import { useState, useEffect } from "react";
import { db } from "../components/Firebase/fbConfig.js";

//https://console.firebase.google.com/project/top-ten-d9fc1/database/top-ten-d9fc1-default-rtdb/data

const useTopTen = (userId, boardId) => {
	const [workingData, setWorkingData] = useState(null);
	const [FbData, setFbData] = useState(null);

	useEffect(() => {
		if (!userId) return null;

		var tasksTableRef = db.ref(`users/${userId}/boards/${boardId}/tasks`);

		return tasksTableRef.on("value", (snap) => {
			const documents = [];
			if (snap !== undefined) {
				snap.forEach((childSnapshot) => {
					var item = { ...childSnapshot.val() };
					item.uid = childSnapshot.key;
					documents.push(item);
				});
			}

			setFbData([documents]);
		});
	}, [userId, boardId]);

	useEffect(() => {
		const finalTasks = [];

		if (FbData) {
			Object.keys(FbData).forEach((t, i) => {
				var thing = Object.values(FbData)[t];
				finalTasks[i] = thing;
			});

			setWorkingData(finalTasks);
		}
	}, [FbData]);

	const AddItem = () => {
		return [];
	};

	return {
		initialData: workingData,
		setInitialData: setWorkingData,
		addItem: AddItem,
	};
};

export default useTopTen;
