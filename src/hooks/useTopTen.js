import { useState, useEffect } from "react";
import { db } from "../components/Firebase/fbConfig.js";

//https://console.firebase.google.com/project/top-ten-d9fc1/database/top-ten-d9fc1-default-rtdb/data

const useTopTen = (userId, boardId) => {
	const [tasks, setTasks] = useState(null);
	const [final, setFinal] = useState(null);

	useEffect(() => {
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

			setTasks(documents);
		});
	}, [userId, boardId]);

	useEffect(() => {
		const finalObject = {};
		finalObject.tasks = [];
		if (tasks) {
			Object.keys(tasks).forEach((t, i) => {
				var thing = Object.values(tasks)[t];
				finalObject.tasks[i] = thing;
			});

			setFinal(finalObject);
		}
	}, [tasks]);

	return { initialData: final, setInitialData: setFinal };
};

export default useTopTen;
