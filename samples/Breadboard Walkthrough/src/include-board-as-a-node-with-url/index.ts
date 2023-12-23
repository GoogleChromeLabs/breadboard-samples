#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import fs from "fs";
import * as url from "url";

const board = new Board({
	title: "Include Board as a Node with URL",
});

const core = board.addKit(Core);

const NESTED_BOARD_URL =
	"https://raw.githubusercontent.com/ExaDev-io/breadboard-samples/more-demos/samples/Breadboard%20Walkthrough/src/include-board-as-a-node-with-url/nestedboard.json";

board
	.input({
		$id: "mainInputNode",
	})
	.wire(
		"mainInput->nestedInput",
		core
			.invoke({ path: NESTED_BOARD_URL })
			.wire("nestedOutput", board.output({ $id: "mainOutputNode" }))
	);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				mainInput: "Hello World!",
			};
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		}
	}
})();

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL(".", import.meta.url)),
});

fs.writeFileSync(
	url.fileURLToPath(new URL("board.json", import.meta.url)),
	JSON.stringify(board, null, "\t")
);
