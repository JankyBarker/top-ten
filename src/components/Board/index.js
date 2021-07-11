import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// import "skeleton-css/css/normalize.css";
// import "skeleton-css/css/skeleton.css";
import "./style.css";

import IconCheck from "../../assets/icon-check.svg";
import initialData from "./initial-data.js";
import { useState } from "react";

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
				id="columnName"
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

function Task({ task, index }) {
	return (
		<DraggableWrapper enableDragDrop={true} id={task.id} index={index}>
			<h4 className="TaskText">{task.content}</h4>
			<div className="TaskFooter">
				<UpIcon />
				<AlignCenterIcon />
				<CheckCircle />
				<CheckCircleComplete />
			</div>
		</DraggableWrapper>
	);
}

function Column({ column: _column, tasks: _tasks, index: _index }) {
	return (
		<Draggable draggableId={_column.id} index={_index} key={_column.id}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					// this needs to be a regular DOM object (a div) not a react component due to below (refs)
					// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
				>
					<div className="ColumnContainer">
						<ColumnHeader title={_column.title} />

						<Droppable droppableId={_column.id} type="task">
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className="ColumnContents"
									style={geColumnStyle(snapshot.isDraggingOver)}
									// this needs to be a regular DOM object (a div) not a react component due to below link (refs)
									// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
								>
									{_tasks.map((task, index) => (
										<Task key={task.id} task={task} index={index} />
									))}
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

function Board({ CurrentUserData: _userData }) {
	const [mainData, SetMainData] = useState(initialData);

	function onDragEnd(result) {
		const { source, destination, draggableId } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const column = mainData.columns[source.droppableId];
		const newTaskIds = Array.from(column.taskIds);

		newTaskIds.splice(source.index, 1);
		newTaskIds.splice(destination.index, 0, draggableId);

		const newColumn = {
			...column,
			taskIds: newTaskIds,
		};

		const newState = {
			...mainData,
			columns: {
				...mainData.columns,
				[newColumn.id]: newColumn,
			},
		};

		SetMainData(newState);
	}

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
							{mainData.columnOrder.map((columnId, i) => {
								const column = mainData.columns[columnId];
								const tasks = column.taskIds.map(
									(taskId) => mainData.tasks[taskId]
								);
								return (
									<Column
										key={columnId}
										column={column}
										tasks={tasks}
										index={i}
									/>
								);
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
}
export default Board;
