#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";

const board: Board = new Board({
	title: "Adding Slot to a Board",
});

const core = board.addKit(Core);

board
	.input({
		$id: "mainInputNode",
	})
	.wire(
		"mainInput->nestedInput",
		core
			.slot({ slot: "nested" })
			.wire("nestedOutput", board.output({ $id: "mainOutputNode" }))
	);

const nested = new Board({
	title: "Nested Board to be Slotted",
});

nested
	.input({
		$id: "nestedInputNode",
	})
	.wire(
		"nestedInput->nestedOutput",
		nested.output({ $id: "nestedOutputNode" })
	);

(async () => {
	for await (const runResult of board.run({
		slots: {
			nested,
		},
	})) {
		if (runResult.type === "input") {
			runResult.inputs = {
				mainInput: "Hello World!",
			};
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
		}
	}
})();

import * as url from 'url';

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL('.', import.meta.url))
});