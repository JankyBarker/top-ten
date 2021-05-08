import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { db } from "../Firebase/fbConfig.js";

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? "lightgreen" : "grey",

	// styles we need to apply on draggables
	...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
	background: isDraggingOver ? "lightblue" : "lightgrey",
	padding: grid,
	width: 250,
});

const Task = ({ index, item, state, ind, setState, tasks, removeTask }) => {
	//console.log(tasks[item.uid].movieTitle);

	if (!tasks) return <span>Loading: Tasks Null</span>;

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
				}}
			></div>
			{tasks[item?.uid]?.movieTitle} {/*//dependency on item data structure */}
			<button
				type="button"
				onClick={function () {
					removeTask(item.uid);
				}}
			>
				delete
			</button>
		</div>
	);
};

function Board({
	UserID,
	BoardID,
	ColumnData,
	SetColumnData,
	TaskData,
	AddGroup,
	AddItem,
	RemoveTask,
}) {
	if (!ColumnData) {
		return <span>Data: Loading Column Data</span>;
	}

	if (!TaskData) {
		return <span>Data: Loading Task Data</span>;
	}

	if (!Array.isArray(ColumnData) || !Array.isArray(ColumnData[0])) {
		return <span>Board: Data Type Error: state not an array of arrays</span>;
	}

	function onDragEnd(result) {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		//each column is a different droppableId
		//use '+' to convert to a number type from the string
		const sourceDropIndex = +source.droppableId;
		const destinationDropIndex = +destination.droppableId;

		//if the source and destination columnIds are the same then we drag within the same column
		if (sourceDropIndex === destinationDropIndex) {
			const items = reorder(
				ColumnData[sourceDropIndex],
				source.index,
				destination.index
			);

			const stateClone = Array.from(ColumnData); //[...state];

			//place all the items we've re-ordered into the right column
			stateClone[sourceDropIndex] = items;
			SetColumnData(stateClone);

			var updates = {};

			stateClone.forEach((column, colIndex) => {
				let postData = column.map((a) => a.uid);

				updates[
					`users/${UserID}/boards/${BoardID}/columns/${colIndex}/`
				] = postData;
			});

			// stateClone.forEach((column) => {
			// 	column.forEach((row, index) => {
			// 		var postData = {
			// 			movieTitle: row.movieTitle,
			// 			priority: index,
			// 		};

			// 		updates[
			// 			"/users/" + UserID + "/boards/" + BoardID + "/tasks/" + row.uid
			// 		] = postData;
			// 	});
			// });

			db.ref()
				.update(updates)
				.then(function () {
					//console.log("Update Succeeded.");
				})
				.catch(function (error) {
					console.log("Update Failed: " + error.message);
				});
		} else {
			const result = move(
				ColumnData[sourceDropIndex],
				ColumnData[destinationDropIndex],
				source,
				destination
			);
			const stateClone = Array.from(ColumnData); //[...state];
			stateClone[sourceDropIndex] = result[sourceDropIndex];
			stateClone[destinationDropIndex] = result[destinationDropIndex];

			//array filter to remove empty columns?
			stateClone.filter((group) => group.length);
			SetColumnData(stateClone);
		}
	}

	return (
		<div>
			<button type="button" onClick={AddGroup}>
				Add Group
			</button>
			<button type="button" onClick={AddItem}>
				Add New Item
			</button>
			<div style={{ display: "flex" }}>
				<DragDropContext onDragEnd={onDragEnd}>
					{ColumnData.map((el, ind) => (
						<Droppable key={ind} droppableId={`${ind}`}>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									style={getListStyle(snapshot.isDraggingOver)}
									{...provided.droppableProps}
								>
									{el.map((item, index) => (
										<Draggable
											key={item.uid} //dependency on item data structure
											draggableId={item.uid} //dependency on item data structure
											index={index}
										>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={getItemStyle(
														snapshot.isDragging,
														provided.draggableProps.style
													)}
												>
													<Task
														index={index}
														item={item}
														state={ColumnData}
														ind={ind}
														setState={SetColumnData}
														tasks={TaskData}
														removeTask={RemoveTask}
													/>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					))}
				</DragDropContext>
			</div>
		</div>
	);
}
export default Board;
