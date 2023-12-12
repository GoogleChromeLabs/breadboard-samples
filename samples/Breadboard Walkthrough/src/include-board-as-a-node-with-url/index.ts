#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Core } from "@google-labs/core-kit"

const board = new Board({
    title: "Include Board as a Node with URL"
});

const coreKit = board.addKit(Core);

const NESTED_BOARD_URL = 'https://raw.githubusercontent.com/ExaDev-io/breadboard-samples/more-demos/samples/Breadboard%20Walkthrough/src/include-board-as-a-node-with-url/nestedboard.json'

board
    .input({
	    $id: "mainInputNode"
    })
    .wire("mainInput->nestedInput",
        coreKit
        .include({path: NESTED_BOARD_URL})
        .wire("nestedOutput", board.output({ $id: "mainOutputNode" }))
    );

(async () => {
	for await (const run of board.run()) {
        if (run.type === "input") {
			run.inputs = {
				mainInput: "Hello World!"
		    };
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		}
	}
})();

import * as url from 'url';

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL('.', import.meta.url))
});