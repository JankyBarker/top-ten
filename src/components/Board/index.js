import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router";
import useTopTen from "../../hooks/useTopTen.js";

// import "skeleton-css/css/normalize.css";
// import "skeleton-css/css/skeleton.css";
import "./style.css";

import IconCheck from "../../assets/icon-check.svg";

function UpIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="21">
			<path fill="none" d="M0 0h24v24H0z"></path>
			<path d="M13 12v8h-2v-8H4l8-8 8 8z" fill="rgba(201,28,28,1)"></path>
		</svg>
	);
}

function AlignCenterIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15">
			<path fill="none" d="M0 0h24v24H0z"></path>
			<path d="M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z"></path>
		</svg>
	);
}

function CheckCircle() {
	return <div className="check-circle"></div>;
}

function CheckCircleComplete() {
	return (
		<div className="check-circle completed">
			<img className="check-icon" src={IconCheck} alt="check-icon" />
		</div>
	);
}

function TrashIcon() {
	return (
		<svg
			className="TrashIcon"
			width="19"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			></path>
		</svg>
	);
}

function ColumnHeader({ title }) {
	return (
		<div className="ColumnHeader">
			<input
				className="ColumnHeaderTextInput"
				type="text"
				id={title}
				name="columnName"
				defaultValue="Hello World"
			/>

			<h2 className="ColumnHeaderText">{title} </h2>

			<div>
				<TrashIcon />
			</div>
		</div>
	);
}

const geColumnStyle = (isDragging) => ({
	// change background colour if dragging
	background: isDragging ? "lightgreen" : "",
});

function DraggableWrapper({ enableDragDrop, id, index, children }) {
	if (!enableDragDrop) return <div className="TaskContents">{children}</div>;

	return (
		<Draggable draggableId={id} index={index} key={id}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					className="TaskContents"
					// this needs to be a regular DOM object (a div) not a react component due to below (refs)
					// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
				>
					{children}
				</div>
			)}
		</Draggable>
	);
}

function Task({ id: _uniqueID, task: _task, index: _index }) {
	return (
		<DraggableWrapper enableDragDrop={true} id={_uniqueID} index={_index}>
			<h4 className="TaskText">{_task.movieTitle}</h4>
			<div className="TaskFooter">
				<UpIcon />
				<AlignCenterIcon />
				<CheckCircle />
				<CheckCircleComplete />
			</div>
		</DraggableWrapper>
	);
}

function Column({ columnData: _columnData, tasks: _tasks, index: _index }) {
	const columnid = `column-${_index}`;

	if (null === _columnData) {
		return <span>ColumnData Error...</span>;
	}

	if (null === _tasks) {
		return <span>TaskData Error...</span>;
	}

	function WriteTaskElement(taskObject, index) {
		const taskData = _tasks[taskObject.uid];
		return (
			<Task
				key={taskObject.uid}
				id={taskObject.uid}
				task={taskData}
				index={index}
			/>
		);
	}

	return (
		/* draggableId must be a unique string */
		// index rule:
		// 		Must be unique within a <Droppable /> (no duplicates)
		// 		Must be consecutive. [0, 1, 2] and not [1, 2, 8]
		<Draggable draggableId={columnid} index={_index} key={columnid}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					// this needs to be a regular DOM object (a div) not a react component due to below (refs)
					// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
				>
					<div className="ColumnContainer">
						<ColumnHeader title={columnid} />

						{/* droppableId must be a unique string */}
						<Droppable droppableId={columnid} type="task">
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className="ColumnContents"
									style={geColumnStyle(snapshot.isDraggingOver)}
									// this needs to be a regular DOM object (a div) not a react component due to below link (refs)
									// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
								>
									{_columnData.map(WriteTaskElement)}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</div>
			)}
		</Draggable>
	);
}

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

//Moves an item from one list to another list.

const move = (
	source,
	destination,
	droppableSource,
	droppableDestination,
	sourceColumnDataIndex,
	destColumnDataIndex
) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);

	const [removed] = sourceClone.splice(droppableSource.index, 1);
	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[sourceColumnDataIndex] = sourceClone;
	result[destColumnDataIndex] = destClone;

	return result;
};

function Board({ CurrentUserData: _userData }) {
	const { boardId } = useParams();

	const _currentUserID = _userData?.uid;

	const {
		ColumnData,
		SetColumnData,
		TaskData,
		// eslint-disable-next-line
		AddMovie,
		AddGroup,
		// eslint-disable-next-line
		RemoveTask,
		UpdateTaskOrder,
	} = useTopTen(_currentUserID, boardId);

	var taskDataFound =
		ColumnData &&
		TaskData &&
		Array.isArray(ColumnData) &&
		Array.isArray(ColumnData[0]);

	if (false === taskDataFound || null === taskDataFound) {
		return <span>Loading Board Data {boardId}...</span>;
	}

	function WriteColumnElements(_columnData, _index) {
		const columnKey = `column-${_index}`;
		return (
			<Column
				key={columnKey}
				columnData={_columnData}
				tasks={TaskData}
				index={_index}
			/>
		);
	}

	function onDragEnd(result) {
		const { source, destination } = result;

		let updateArrayLength = 0;
		let finalArray = null;

		function isEmpty(group) {
			if (!group) {
				return false;
			}

			return group.length;
		}

		//remove characters and symbols from the droppableId to get the index of the column
		const sourceColumnDataIndex = parseInt(
			source.droppableId.replace(/[^\d.]/g, "")
		);
		const destColumnDataIndex = parseInt(
			destination.droppableId.replace(/[^\d.]/g, "")
		);

		// dropped outside the list
		if (!destination) {
			return;
		}

		//didn't re-order anything
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		//if the source and destination columnIds are the same then we drag within the same column
		if (sourceColumnDataIndex === destColumnDataIndex) {
			const items = reorder(
				ColumnData[sourceColumnDataIndex],
				source.index,
				destination.index
			);

			const stateClone = Array.from(ColumnData);

			//place all the items we've re-ordered into the right column
			stateClone[sourceColumnDataIndex] = items;

			//the now potentially empty columns need to be updated
			updateArrayLength = stateClone.length;

			finalArray = stateClone.filter(isEmpty);
		} else {
			const result = move(
				ColumnData[sourceColumnDataIndex],
				ColumnData[destColumnDataIndex],
				source,
				destination,
				sourceColumnDataIndex,
				destColumnDataIndex
			);

			const stateClone = Array.from(ColumnData);
			stateClone[sourceColumnDataIndex] = result[sourceColumnDataIndex];
			stateClone[destColumnDataIndex] = result[destColumnDataIndex];

			//the now potentially empty columns need to be updated
			updateArrayLength = stateClone.length;

			//array filter to remove empty columns
			// let finalArray = stateClone.filter(isEmpty);
			finalArray = stateClone.filter(isEmpty);
		}

		SetColumnData(finalArray);

		UpdateTaskOrder(finalArray, updateArrayLength);
	}

	//https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/drag-drop-context.md

	return (
		<div className="App-Page">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="allCols" type="column" direction="horizontal">
					{(provided) => (
						<div
							className="ColumnGrid"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{ColumnData.map(WriteColumnElements)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<button type="button" onClick={AddGroup}>
				Add Group
			</button>
		</div>
	);
}
export default Board;
