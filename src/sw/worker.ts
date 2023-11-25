/// <reference lib="webworker" />

// declare const self: DedicatedWorkerGlobalScope;
declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
	console.debug("install", event);
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
	console.debug("activate", event);
	event.waitUntil(self.clients.claim());
});

import { Board, LogProbe } from "@google-labs/breadboard";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import { updateCounter } from "~/services/counterService.ts";
import { loadData, storeData } from "~/services/databaseService.ts";

let loopActive: boolean = false;
let loopPaused: boolean = false;
const broadcastChannel: BroadcastChannel = new BroadcastChannel(
	BROADCAST_CHANNEL
);
const inputNodeID = "input";
const pendingInputResolvers: { [key: string]: (input: string) => void } = {};

function makeBoard(): Board {
	const board = new Board();
	const input = board.input({ $id: inputNodeID });
	const input2 = board.input({ $id: "input2" });
	const output = board.output({ $id: "output" });
	input.wire("message", output);
	input2.wire("message", output);
	const output2 = board.output({ $id: "output2" });
	input.wire("message->messageOne", output2);
	input2.wire("message->message2", output2);
	return board;
}

function waitForInput(nodeID: string) {
	return new Promise<string>((resolve) => {
		pendingInputResolvers[nodeID] = resolve;
	});
}

type Receiver = {
	log: (...args: unknown[]) => void;
};

async function runBoard() {
	const board = makeBoard();
	const logReceiver: Receiver = { log: (message) => console.debug(message) };

	for await (const runResult of board.run({
		probe: new LogProbe(logReceiver),
	})) {
		if (!loopActive) break;
		if (loopPaused) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			continue;
		}

		if (runResult.type === "input") {
			broadcastChannel.postMessage({
				type: "inputNeeded",
				nodeID: runResult.node.id,
				message: "Input required for node " + runResult.node.id,
			});

			const userInput = await waitForInput(runResult.node.id);
			runResult.inputs = { message: userInput };
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
		}
	}
}

function handleCommand(data: {
	command: string;
	key?: string;
	data?: unknown;
	store?: string;
	dbName?: string;
	nodeID?: string;
	userInput?: string;
}) {
	switch (data.command) {
		case "inputResponse":
			if (data.nodeID && data.userInput) {
				const resolver = pendingInputResolvers[data.nodeID];
				if (resolver) {
					resolver(data.userInput);
					delete pendingInputResolvers[data.nodeID];
				}
			}
			break;
		case "start":
			if (!loopActive) {
				updateCounter(0).then();
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
			break;
	}
}

broadcastChannel.onmessage = (event) => handleCommand(event.data);
self.addEventListener("message", (event) => handleCommand(event.data));
