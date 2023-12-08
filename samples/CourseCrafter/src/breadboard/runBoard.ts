#!/usr/bin/env npx -y tsx
import board from "./board";
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: "./",
});

for await (const runResult of board.run()) {
	console.log(runResult.node.id);
	if (runResult.type === "input") {
		console.log("input");
	} else if (runResult.type === "output") {
		console.log(runResult.outputs);
	}
}
