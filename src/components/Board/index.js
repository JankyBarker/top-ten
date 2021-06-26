import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router";
import useTopTen from "../../hooks/useTopTen.js";
import { db } from "../Firebase/fbConfig.js";

// import "skeleton-css/css/normalize.css";
// import "skeleton-css/css/skeleton.css";
import "./style.css";

import IconCheck from "../../assets/icon-check.svg";

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

const AddTask = ({ funcAddMovie }) => {
	if (!funcAddMovie) {
		return <span>Add Movie Function Invalid...</span>;
	}

	const addTask = (e) => {
		e.preventDefault();

		const title = e.target.elements.newTaskTitle.value;
		if (!title) return;

		funcAddMovie(title, 0);

		e.target.elements.newTaskTitle.value = "";
	};

	return (
		<div>
			<form onSubmit={addTask} autoComplete="off">
				<h4>Add a New Task</h4>

				<div>
					<div>
						<label htmlFor="newTaskTitle">Title:</label>
						<input maxLength="45" required type="text" name="newTaskTitle" />
					</div>
				</div>

				<button>Add Task</button>
			</form>
		</div>
	);
};

const Task = ({ item, ind, tasks, removeTask }) => {
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
					removeTask(item.uid, ind);
				}}
			>
				delete
			</button>
		</div>
	);
};

function Board({ CurrentUserData: _userData }) {
	return (
		<div className="App-Page">
			<div className="heading">
				<div className="heading-first">
					<h1>TODO</h1>
				</div>
				<div className="card">
					<div className="card-item">
						<div className="check-circle"></div>
						<input
							className="todo-input"
							type="text"
							title="New Todo input"
							placeholder="Create a new todo..."
						/>
						<img src={IconCheck} alt="check-icon" />
					</div>
				</div>
			</div>

			<div className="grid-container">
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
				<div className="rectangle"></div>
			</div>
		</div>
	);
}

//eslint-disable-next-line
function Board_old({ CurrentUserData: _userData }) {
	const { boardId } = useParams();

	const _currentUserID = _userData?.uid;

	const {
		ColumnData,
		SetColumnData,
		TaskData,
		AddMovie,
		AddGroup,
		RemoveTask,
	} = useTopTen(_currentUserID, boardId);

	var taskDataFound =
		ColumnData &&
		TaskData &&
		Array.isArray(ColumnData) &&
		Array.isArray(ColumnData[0]);

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

			const stateClone = Array.from(ColumnData);

			//place all the items we've re-ordered into the right column
			stateClone[sourceDropIndex] = items;
			SetColumnData(stateClone);

			let updates = {};

			stateClone.forEach((column, colIndex) => {
				let postData = column.map((a) => a.uid);

				updates[`/boards/${boardId}/columns/${colIndex}/`] = postData;
			});

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

			var arrayLength = stateClone.length;

			function isEmpty(group) {
				if (!group) {
					return false;
				}

				return group.length;
			}

			//array filter to remove empty columns?
			let finalArray = stateClone.filter(isEmpty);
			SetColumnData(finalArray);

			let updates = {};

			for (let i = 0; i < arrayLength; i++) {
				let column = finalArray[i];
				let colIndex = i;

				let postData = column ? column.map((a) => a.uid) : null;
				console.log(colIndex + " " + postData);

				updates[`/boards/${boardId}/columns/${colIndex}/`] = postData;
			}

			console.table(updates);

			db.ref()
				.update(updates)
				.then(function () {
					//console.log("Update Succeeded.");
				})
				.catch(function (error) {
					console.log("Update Failed: " + error.message);
				});
		}
	}

	return (
		<div>
			{taskDataFound ? (
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
															item={item}
															ind={ind}
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
			) : (
				<span>Data: Loading Task Data</span>
			)}
			<button type="button" onClick={AddGroup}>
				Add Group
			</button>
			<AddTask funcAddMovie={AddMovie} />
		</div>
	);
}
export default Board;
