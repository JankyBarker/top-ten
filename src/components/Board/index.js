import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router";
import useTopTen from "../../hooks/useTopTen.js";
import { TrashIcon } from "../Icons.js";
import MovieTask from "../MovieTask/index.js";
// import "skeleton-css/css/normalize.css";
// import "skeleton-css/css/skeleton.css";
import "./style.css";

function AddGroupForm({ AddGroupCommand }) {
	const [groupName, setInputField] = useState();

	function OnInputTextChange(e) {
		setInputField(e.target.value);
	}

	function onSubmit(e) {
		e.preventDefault();
		//alert(groupName);
		AddGroupCommand(groupName);
		setInputField("");
	}

	return (
		<div>
			<form onSubmit={onSubmit} autoComplete="off">
				<input
					type="text"
					name="input_first_name"
					onChange={OnInputTextChange}
					placeholder="Add a new Group"
					value={groupName}
					maxLength="20"
				/>
			</form>
		</div>
	);
}

function ColumnHeader({ title, columnID, deleteCol }) {
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

			<div onClick={() => deleteCol(columnID)}>
				<TrashIcon />
			</div>
		</div>
	);
}

function geColumnStyle(isDragging) {
	return { background: isDragging ? "lightgreen" : "" };
}

function Column({
	columnTitle: _columnTitle,
	columnData: _columnData,
	tasks: _tasks,
	index: _index,
	deleteCol: _deleteCol,
	deleteTask: _deleteTask,
}) {
	const columnid = `column-${_index}`;

	if (null === _columnData) {
		return <span>ColumnData Error...</span>;
	}

	function WriteTaskElement(taskObject, index) {
		//console.log(taskObject);

		if (!_tasks) return;

		const taskData = _tasks[taskObject.uid];

		if (!taskData) return;

		return (
			<MovieTask
				key={taskObject.uid}
				id={taskObject.uid}
				task={taskData}
				index={index}
				RemoveTaskCommand={_deleteTask}
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
						<ColumnHeader
							title={_columnTitle}
							columnID={columnid}
							deleteCol={_deleteCol}
						/>

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
		ColumnNames,
		TaskData,
		AddMovie,
		AddGroup,
		RemoveTask,
		UpdateTaskOrder,
		RemoveColumn,
	} = useTopTen(_currentUserID, boardId);

	function DeleteColumn(_colId) {
		const colIndex = ParseColumnID(_colId);
		console.log("delete Column " + colIndex);
		RemoveColumn(colIndex);
	}

	function WriteColumnElements(_columnData, _index) {
		const columnKey = `column-${_index}`;

		const columnName =
			ColumnNames && _index < ColumnNames.length
				? ColumnNames[_index]
				: "Name Error";

		return (
			<Column
				columnTitle={columnName}
				key={columnKey}
				columnData={_columnData}
				tasks={TaskData}
				index={_index}
				deleteCol={DeleteColumn}
				deleteTask={RemoveTask}
			/>
		);
	}

	function ParseColumnID(columnUniqueID) {
		//remove characters and symbols from the droppableId to get the index of the column
		return columnUniqueID.replace(/[^\d.]/g, "");
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

		if (result.type === "task") {
			const sourceColumnDataIndex = ParseColumnID(source.droppableId);
			const destColumnDataIndex = ParseColumnID(destination.droppableId);

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
		} else {
			const stateClone = Array.from(ColumnData);

			const element = stateClone.splice(source.index, 1);
			stateClone.splice(destination.index, 0, element[0]);

			//the now potentially empty columns need to be updated
			updateArrayLength = stateClone.length;

			//array filter to remove empty columns
			finalArray = stateClone.filter(isEmpty);
		}

		UpdateTaskOrder(finalArray, updateArrayLength);
	}

	//https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/drag-drop-context.md

	const tempAddMovieWrap = (event) => {
		event.preventDefault();
		AddMovie("eh", 0);
	};

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
							{ColumnData?.map(WriteColumnElements)}
							{provided.placeholder}
							<AddGroupForm AddGroupCommand={AddGroup} />
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<button type="button" onClick={tempAddMovieWrap}>
				Add Movie
			</button>
		</div>
	);
}
export default Board;
