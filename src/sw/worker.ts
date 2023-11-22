// @/src/sw/worker.ts
/// <reference lib="webworker" />
// declare const self: DedicatedWorkerGlobalScope;

let isPaused = false;
let isStopped = false;
let isRunning = false;

const asyncLoop = async () => {
	let loop = 0;
	isRunning = true;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (isStopped) break;
		while (isPaused) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}

		const currentDateTime = new Date().toISOString();
		console.log("worker", loop++, currentDateTime);
		postMessage({
			currentDateTime,
			iteration: loop,
		});

		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	isRunning = false;
};

self.onmessage = (event) => {
	if (event.data.command === "start") {
		console.log("worker", "start");
		isPaused = false;
		isStopped = false;
		if (!isRunning) {
			asyncLoop().then();
		}
	} else if (event.data.command == "pause") {
		console.log("worker", "pause");
		isPaused = true;
	} else if (event.data.command === "stop") {
		console.log("worker", "stop");
		isStopped = true;
	}
};
