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

import { LogProbe } from "@google-labs/breadboard";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import { updateCounter } from "~/services/counterService.ts";
import { makeBoard } from "./makeBoard";

let loopActive: boolean = false;
let loopPaused: boolean = false;
const broadcastChannel: BroadcastChannel = new BroadcastChannel(
	BROADCAST_CHANNEL
);

const pendingInputResolvers: { [key: string]: (input: string) => void } = {};

function waitForInput(node: string, attrib: string): Promise<string> {
	return new Promise<string>((resolve) => {
		pendingInputResolvers[`${node}-${attrib}`] = resolve;
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
			const nodeId = runResult.node.id;

			const inputAttribute: string =
				runResult.state.newOpportunities.find(
					(op) => op.from == nodeId
				)!.out!;

			console.debug({
				type: runResult.type,
				node: runResult.node,
				state: runResult.state,
			});

			console.debug(
				["Node", runResult.node.id, "requires", inputAttribute].join(
					" "
				)
			);
			broadcastChannel.postMessage({
				type: "inputNeeded",
				node: runResult.node.id,
				attribute: inputAttribute,
				message: [runResult.node.id, "requires", inputAttribute].join(
					" "
				),
			});

			const userInput = await waitForInput(
				runResult.node.id,
				inputAttribute
			);
			if (runResult.node.id == "input1") {
				runResult.inputs = { ["msgOne"]: userInput };
			} else if (runResult.node.id == "input2") {
				runResult.inputs = { ["msgTwo"]: userInput };
			}
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
			broadcastChannel.postMessage({
				type: "output",
				node: runResult.node.id,
				output: runResult.outputs,
			});
		}
	}
}

function handleCommand(data: {
	attribute: string;
	value: string;
	command: string;
	key?: string;
	data?: unknown;
	store?: string;
	dbName?: string;
	node?: string;
	userInput?: string;
}) {
	switch (data.command) {
		case "inputResponse":
			if (data.node && data.value) {
				const resolver =
					pendingInputResolvers[`${data.node}-${data.attribute}`];
				// const resolver = pendingInputResolvers[data.node]
				if (resolver) {
					resolver(data.value);
					delete pendingInputResolvers[
						`${data.node}-${data.attribute}`
					];
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
