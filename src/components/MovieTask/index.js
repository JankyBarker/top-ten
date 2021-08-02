import { Draggable } from "react-beautiful-dnd";

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

function MovieTask({ id: _uniqueID, task: _task, index: _index }) {
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

export default MovieTask;
