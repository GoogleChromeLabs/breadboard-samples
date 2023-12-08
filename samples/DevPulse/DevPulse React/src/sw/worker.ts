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
import { makeBoard } from "../breadboard/makeBoard";
import { WorkerStatus } from "./types";
import { Stories } from "~/core/Stories";
import { StoryOutput } from "~/hnStory/domain";

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

const ignoredOutputNodeIds = [
	"testCompletion",
	"algoliaSearchUrl",
	"postSummarisation",
];

type Receiver = {
	log: (...args: unknown[]) => void;
};

async function runBoard() {
	const board = makeBoard();
	const logReceiver: Receiver = { log: (message) => console.debug(message) };

	broadcastWorkerStatus("running")

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
				message: ["Please type in", runResult.node.id].join(
					" "
				),
			});

			const userInput = await waitForInput(
				runResult.node.id,
				inputAttribute
			);

			runResult.inputs = { [inputAttribute]: userInput };
		}
		if (runResult.type === "output") {
			if (runResult.outputs?.story_id) {
				const id = runResult.outputs.story_id as number;
				Stories.add(id, runResult.outputs);
			} else if (ignoredOutputNodeIds.includes(runResult.node.id)) {
				//
			} else {
				throw new Error(`node: ${runResult.node.id}`);
			}
			const output = {
				output: Stories.getAll() as StoryOutput[],
			};
			console.log(output);
			broadcastChannel.postMessage(output);
		}
	}
	broadcastWorkerStatus("finished")
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
			broadcastWorkerStatus("paused")
			break;
		case "stop":
			loopActive = false;
			broadcastWorkerStatus("stopped")
			break;
	}
}

function broadcastWorkerStatus(status: WorkerStatus) {
	broadcastChannel.postMessage({
		type: "status",
		status,
		source: "worker",
	})
}

broadcastChannel.onmessage = (event) => handleCommand(event.data);
self.addEventListener("message", (event) => handleCommand(event.data));
