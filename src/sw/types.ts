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
} as const;

export type WorkerStatus = (typeof WorkerStatus)[keyof typeof WorkerStatus];
