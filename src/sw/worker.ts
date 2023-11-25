/// <reference lib="webworker" />

// declare const self: DedicatedWorkerGlobalScope;
declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
	console.debug("install", event);
	event.waitUntil(self.skipWaiting()); // Forces the waiting service worker to become the active service worker
});

self.addEventListener("activate", (event) => {
	console.debug("activate", event);
	console.debug("clients", self.clients);
	event.waitUntil(self.clients.claim()); // Immediately control any open clients
});

type Receiver = {
	log: (...args: unknown[]) => void;
};

import { Board, LogProbe } from "@google-labs/breadboard";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import { loadCounter, updateCounter } from "~/services/counterService.ts";
import { loadData, storeData } from "~/services/databaseService.ts";

let iteration: number = 0;
let loopActive: boolean = false;
let loopPaused: boolean = false;

const broadcastChannel: BroadcastChannel = new BroadcastChannel(
	BROADCAST_CHANNEL
);

// Main loop for counter
async function asyncLoop() {
	await loadCounter();
	while (loopActive) {
		if (!loopPaused) {
			iteration++;
			await updateCounter(iteration);
			console.debug("serviceWorker", "Loop", iteration);
			broadcastChannel.postMessage({
				iteration,
				currentDateTime: new Date().toISOString(),
			});
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	iteration = 0;
	await updateCounter(iteration);
}

const inputNodeID = "input";

function makeBoard(): Board {
	const board = new Board()
	const input = board.input({
		$id: inputNodeID,
	})
	const output = board.output({
		$id: "output",
	})
	input.wire("message", output)

	return board
}

const pendingInputResolvers: {
	[key: string]: (input: string) => void
} = {};

function waitForInput(nodeID: string) {
	console.debug("waitForInput", nodeID);
	return new Promise((resolve) => {
		// Store the resolver function in an object so it can be called when input is received
		pendingInputResolvers[nodeID] = resolve;
	});
}

async function runBoard() {
	const board = makeBoard();
	const logReceiver: Receiver = {
		log: (message) => {
			console.debug(message);
		},
	};

	for await (const runResult of board.run({
		probe: new LogProbe(logReceiver),
	})) {
		// Check if loop should stop
		if (!loopActive) break;

		// Check if loop is paused
		if (loopPaused) {
			await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
			continue;
		}

		if (runResult.type === "input") {
			console.log(runResult.node.id, "requesting input")
			broadcastChannel.postMessage({
				type: 'inputNeeded',
				nodeID: runResult.node.id,
				message: 'Input required for node ' + runResult.node.id
			});

			// Wait for input
			const result: any = await waitForInput(runResult.node.id);
			console.debug("waitForInput result", result);

			//
			// if (runResult.node.id === inputNodeID) {
			// 	const message = await loadCounter();
			runResult.inputs = {
				message: result
			}
			// }
			console.log(runResult.node.id, "requesting input")
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs)
		}
	}
}

// Message handling for Broadcast Channel and direct messages
function handleCommand(data: {
	command: string;
	key: string | undefined;
	data: unknown;
	store: string | undefined;
	dbName: string | undefined;
	nodeID: string | undefined;
}) {
	console.debug("serviceWorker", "handleCommand", data);
	switch (data.command) {
		case "inputResponse":
			// const resolver = pendingInputResolvers[data.nodeID];
			// if (resolver) {
			// 	resolver(data.userInput); // Assuming data.userInput contains the necessary input
			// 	delete pendingInputResolvers[data.nodeID]; // Clean up
			// }
			// if (data.command === 'inputResponse' && data.nodeID) {
			// 	const resolver = pendingInputResolvers[data.nodeID];
			// 	if (resolver) {
			// 		resolver(data.userInput); // Assuming data.userInput contains the necessary input
			// 		delete pendingInputResolvers[data.nodeID]; // Clean up
			// 	}
			// }
			if (data.nodeID) {
				const resolver = pendingInputResolvers[data.nodeID];
				if (resolver) {
					resolver(data.userInput); // Assuming data.userInput contains the necessary input
					delete pendingInputResolvers[data.nodeID]; // Clean up
				}
			}
			break;
		case "start":
			if (!loopActive) {
				// iteration = 0;
				updateCounter(iteration).then();
				// asyncLoop().then(() => console.debug("asyncLoop finished"));
				runBoard().then(() => console.debug("runBoard finished"));
			} else {
				console.debug("Loop already active");
			}
			loopActive = true;
			loopPaused = false;
			break;
		case "pause":
			loopPaused = true;
			break;
		case "stop":
			loopActive = false;
			loopPaused = false;
			break;
		case "store":
			storeData(data.key!, data.data, data.store, data.dbName).then((r) =>
				console.debug("storeData finished", r)
			);
			break;
		case "load":
			loadData(data.key).then((loadedData) => {
				broadcastChannel.postMessage({
					type: "loadedData",
					key: data.key,
					data: loadedData,
				});
			});
			break;
	}
}

broadcastChannel.onmessage = (event) => {
	console.debug("serviceWorker", "broadcastChannel.onmessage", event);
	handleCommand(event.data);
};

self.addEventListener("message", (event) => {
	console.debug("serviceWorker", "self.addEventListener('message')", event);
	handleCommand(event.data);
});
