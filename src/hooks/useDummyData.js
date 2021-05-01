import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// fake data generator
const getItems = (count, offset = 0) => {
	return Array.from({ length: count }, (v, k) => k).map((k) => ({
		uid: `item-${k + offset}-${new Date().getTime()}`,
		movieTitle: `item ${k + offset}`,
	}));
};

const Initial_Data = [
	{ uid: 0, movieTitle: 50 },
	{ uid: 1, movieTitle: "swimming" },
	{ uid: 2, movieTitle: "drunking" },
	{ uid: 3, movieTitle: "pooping" },
];

const GetInitialData = () => {
	var newArray = [];

	// Since the array is initialized with `undefined` on each position,
	// the value of `v` below will be `undefined`
	//'v' is the current value at that position in the array
	//'k' is the index of the position in the array
	newArray = Array.from(
		/*an object with a "length" property*/ { length: Initial_Data.length },
		(v, k) => k
	).map((k) => ({
		//uid:must be a string because it is used as a draggableId for react-beautiful-dnd
		//uid:appending a uuidv4 to guarantee uniqueness

		uid: `item-${Initial_Data[k].uid}-${uuidv4()}`,
		movieTitle: Initial_Data[k].movieTitle,
	}));

	//newArray = Array.from(Initial_Data);
	return newArray;
};

const useDummyData = (userId, boardId) => {
	const [final, setFinal] = useState(null);

	//const [state] = useState([getItems(10), getItems(5, 10)]);

	const [state] = useState([GetInitialData(), GetInitialData()]);

	useEffect(() => {
		const finalTasks = [];

		if (state) {
			Object.keys(state).forEach((t, i) => {
				var thing = Object.values(state)[t];
				finalTasks[i] = thing;
			});

			setFinal(finalTasks);
		}
	}, [state]);

	const AddItem = () => {
		return getItems(1);
	};

	return [final, setFinal, AddItem];
};

export default useDummyData;
