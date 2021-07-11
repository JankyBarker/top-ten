const initialData = {
	tasks: {
		"task-1": { id: "task-1", content: "Take out the garbage" },
		"task-2": { id: "task-2", content: "Watch show" },
		"task-3": { id: "task-3", content: "Charge Phone" },
		"task-4": { id: "task-4", content: "Cook dinner" },
	},

	columns: {
		"column-1": {
			id: "column-1",
			title: "To Do 1",
			taskIds: ["task-1", "task-2", "task-3", "task-4"],
		},
		"column-2": {
			id: "column-2",
			title: "To Do 2",
			taskIds: [],
		},
	},

	columnOrder: ["column-1", "column-2"],
};

export default initialData;
