#!/usr/bin/env npx -y tsx

import { LogProbe } from "@google-labs/breadboard";
import board from "./board";
const logReceiver: Receiver = { log: (message) => console.debug(message) };

type Receiver = {
	log: (...args: unknown[]) => void;
};

for await (const runResult of board.run({
	// probe: new LogProbe(),
	// probe: new LogProbe(logReceiver),
})) {
	console.log("-".repeat(10));
	if (runResult.type === "input") {
		console.log("input", runResult.node.id);
	}
	if (runResult.type === "output") {
		console.log("output", runResult.node.id, runResult.outputs);
	}
}
