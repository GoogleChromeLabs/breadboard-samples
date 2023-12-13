#!/usr/bin/env npx -y tsx

import { Board, GraphDescriptor } from "@google-labs/breadboard";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Core } from "@google-labs/core-kit"

const nestedBoard = new Board({
    title: "Nested Board"
});

nestedBoard.input({
	$id: "nestedInputNode"
}).wire("nestedInput->nestedOutput", nestedBoard.output({ $id:"nestedOutputNode" }));

const board = new Board({
    title: "Include Board as a Node"
});

const coreKit = board.addKit(Core);

board
    .input({
	    $id: "mainInputNode"
    })
    .wire("mainInput->nestedInput",
        coreKit
        .include({graph: nestedBoard as GraphDescriptor})
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