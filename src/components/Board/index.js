import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// import "skeleton-css/css/normalize.css";
// import "skeleton-css/css/skeleton.css";
import "./style.css";

import IconCheck from "../../assets/icon-check.svg";
import initialData from "./initial-data.js";
import { useState } from "react";

function Container({ children }) {
	return <div>{children} </div>;
}

function Title({ children }) {
	return <h3>{children} </h3>;
}

const geColumnStyle = (isDragging) => ({
	// change background colour if dragging
	background: isDragging ? "lightgreen" : "white",
});

function TaskList({ isDraggingOver, children }) {
	return <div style={geColumnStyle(isDraggingOver)}>{children} </div>;
}

//https://www.w3schools.com/react/react_css.asp - remember css in React is an object e.g. background-color
//is turned into backgroundColor

function GetCSS(isDragging) {
	return isDragging ? "card-item-drag" : "card-item";
}

function Task({ task, index }) {
	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					// this needs to be a regular DOM object (a div) not a react component due to below (refs)
					// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
				>
					<div className={GetCSS(snapshot.isDragging)}>
						<div className="check-circle"></div>
						<div> {task.content} </div>
						<div className="check-circle completed">
							<img className="check-icon" src={IconCheck} alt="check-icon" />
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}

function Column({ column: _column, tasks: _tasks }) {
	return (
		<Container>
			<Title> {_column.title} </Title>
			<Droppable droppableId={_column.id}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}

						// this needs to be a regular DOM object (a div) not a react component due to below (refs)
						// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/using-inner-ref.md
					>
						<TaskList isDraggingOver={snapshot.isDraggingOver}>
							{_tasks.map((task, index) => (
								<Task key={task.id} task={task} index={index} />
							))}
							{provided.placeholder}
						</TaskList>
					</div>
				)}
			</Droppable>
		</Container>
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
			<div className="heading">
				<div className="heading-first">
					<h1>TODO</h1>
				</div>
				<div className="card-column">
					<div className="card-item">
						<div className="check-circle"></div>
						<input
							className="todo-input"
							type="text"
							title="New Todo input"
							placeholder="Create a new todo..."
						/>
					</div>

					<div className="card-item">
						<div className="check-circle completed">
							<img className="check-icon" src={IconCheck} alt="check-icon" />
						</div>
						<p className="task-completed">Complete online JavaScript course</p>
					</div>
				</div>
			</div>

			<div className="card-column">
				<DragDropContext onDragEnd={onDragEnd}>
					{mainData.columnOrder.map((columnId) => {
						const column = mainData.columns[columnId];
						const tasks = column.taskIds.map(
							(taskId) => mainData.tasks[taskId]
						);

						return <Column key={columnId} column={column} tasks={tasks} />;
					})}
				</DragDropContext>
			</div>
		</div>
	);
}
export default Board;
