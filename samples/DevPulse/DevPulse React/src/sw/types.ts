export type WorkerMessage = {
	output: {
		[key: string]: unknown;
	}[];
	attribute?: string;
	iteration?: number;
	currentDateTime?: string;
	type?: string;
	node?: string;
	message?: string;
};

export type WorkerData = {
	node: string;
	attribute: string;
	message?: string;
	value?: unknown;
};

export const WorkerStatus = {
	idle: "idle",
	running: "running",
	paused: "paused",
	stopped: "stopped",
	loading: "loading",
	finished: "finished",
} as const;

export type WorkerStatus = (typeof WorkerStatus)[keyof typeof WorkerStatus];


export const OutputNodeIds = {
	searchResultData: "searchResultData",
	summary: "summary",
	storyData: "storyData"
} as const;

export type OutputNodeIds = (typeof OutputNodeIds)[keyof typeof OutputNodeIds];

export type NodeData = {
	node: string; // node id
	type: "input" | "output";
}
export type OutputNodeData = NodeData & {
	type: "output";
	timestamp: number;
	output: { [key: string]: unknown };
}