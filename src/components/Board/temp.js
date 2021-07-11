import { useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { db, firebase } from "../firebase/fbConfig";
import { Link } from "react-router-dom";
import Column from "../components/Column";
import Modal from "../components/Modal";
import AddTask from "../screens/AddTask";
import { Add, Github } from "../components/Icons";

import useKanbanData from "../hooks/useKanbanData";
import { debounce } from "../utils";

const Kanban = ({ userId }) => {
	return (
		<>
			{initialData ? (
				<>
					<main className="pb-2 h-screen w-screen">
						<div className="flex flex-col h-full">
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable
									droppableId="allCols"
									type="column"
									direction="horizontal"
								>
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="grid overflow-x-auto h-full items-start pt-3 md:pt-2 mx-1 md:mx-6 auto-cols-220 md:auto-cols-270 grid-flow-col"
											style={{ height: "90%" }}
										>
											{initialData?.columnOrder.map((col, i) => {
												const column = initialData?.columns[col];
												const tasks = column.taskIds?.map((t) => t);
												return (
													<Draggable
														draggableId={column.id}
														index={index}
														key={column.id}
													>
														{(provided) => (
															<div
																{...provided.draggableProps}
																ref={provided.innerRef}
																className="mr-5"
															>
																<div style={{ background: "#edf2ff" }}>
																	<div
																		{...provided.dragHandleProps}
																		className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 flex items-center justify-between px-4 py-1 rounded-sm"
																	>
																		<input
																			ref={colInput}
																			className={`sm:text-xl text-blue-700 text-lg px-2 w-10/12 ${
																				editingCol ? "" : "hidden"
																			}`}
																			onBlur={() => setEditing(false)}
																			type="text"
																			defaultValue={column.title}
																			onChange={(e) =>
																				changeColName(e, column.id)
																			}
																		/>

																		<h2
																			className={`sm:text-lg text-blue-100 truncate text-lg ${
																				editingCol ? "hidden" : ""
																			}`}
																			onClick={moveToInp}
																		>
																			{column.title}{" "}
																		</h2>

																		<div
																			className="text-blue-700 hover:text-blue-50 cursor-pointer"
																			onClick={() => setModal(true)}
																		>
																			<Bin />
																		</div>
																	</div>

																	<Droppable
																		droppableId={column.id}
																		type="task"
																	>
																		{(provided, snapshot) => (
																			<div
																				{...provided.droppableProps}
																				ref={provided.innerRef}
																				className={`shadow-sm h-full py-4 px-2 ${
																					snapshot.isDraggingOver
																						? "bg-gradient-to-br from-green-400 via-green-200 to-green-100"
																						: ""
																				}`}
																			>
																				{tasks.map((t, i) => (
																					<Task
																						allData={allData}
																						id={t}
																						index={i}
																						key={t}
																						boardId={boardId}
																						userId={userId}
																						columnDetails={column}
																						filterBy={filterBy}
																					/>
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
											})}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div>
					</main>
				</>
			) : (
				<div className="spinner h-screen w-screen" />
			)}
		</>
	);
};

export default Kanban;
