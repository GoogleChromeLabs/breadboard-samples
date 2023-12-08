#!/usr/bin/env npx -y tsx
import board from "./board";

for await (const runResult of board.run()) {
	console.log(runResult.node.id);
	if (runResult.type === "input") {
		console.log("input");
	} else if (runResult.type === "output") {
		console.log(runResult.outputs);
	}
}
