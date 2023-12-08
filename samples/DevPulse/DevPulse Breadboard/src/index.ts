#!/usr/bin/env npx -y tsx watch
import exadev from "@exadev/breadboard-kits";
import { hackerNewsBoard } from "./hackerNewsBoard.js";
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
////////////////////////////////////////////////

generateAndWriteCombinedMarkdown({
	board: hackerNewsBoard,
	dir: "./",
	filename: "README",
});

const suppressedOutputIds = ["commentOutput", "fullCommentData"];

for await (const run of hackerNewsBoard.run({
	// probe: new LogProbe(),
})) {
	if (run.type == "output") {
		if (suppressedOutputIds.includes(run.node.id)) {
			continue;
		}
		console.log(run.node.id, run.outputs);
	}
}
