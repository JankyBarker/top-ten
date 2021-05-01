import { useState, useEffect } from "react";

// fake data generator
const getItems = (count, offset = 0) => {
	return Array.from({ length: count }, (v, k) => k).map((k) => ({
		uid: `item-${k + offset}-${new Date().getTime()}`,
		movieTitle: `item ${k + offset}`,
	}));
};

const useDummyData = (userId, boardId) => {
	const [final, setFinal] = useState(null);

	const [state, setState] = useState([getItems(10), getItems(5, 10)]);

	useEffect(() => {
		const finalObject = {};
		finalObject.tasks = [];
		if (state) {
			Object.keys(state).forEach((t, i) => {
				var thing = Object.values(state)[t];
				finalObject.tasks[i] = thing;
			});

			setFinal(finalObject);
		}
	}, [state]);

	return [final, setState];
};

export default useDummyData;
