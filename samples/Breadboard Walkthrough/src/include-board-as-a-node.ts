#!/usr/bin/env npx -y tsx

import { Board, GraphDescriptor } from "@google-labs/breadboard";
import path from "path";
import exadev from "@exadev/breadboard-kits";
import { Core } from "@google-labs/core-kit"

const nestedBoard = new Board({
    title: path.basename(new URL(import.meta.url).pathname),
});

nestedBoard.input({
	$id: "nestedInputNode"
}).wire("nestedInput->nestedOutput", nestedBoard.output({ $id:"nestedOutputNode" }));

const mainBoard = new Board({
    title: path.basename(new URL(import.meta.url).pathname),
});

const coreKit = mainBoard.addKit(Core);

mainBoard
    .input({
	    $id: "mainInputNode"
    })
    .wire("mainInput->nestedInput",
        coreKit
        .include({graph: nestedBoard as GraphDescriptor})
        .wire("nestedOutput", mainBoard.output({ $id: "mainOutputNode" }))
    );

(async () => {
	for await (const run of mainBoard.run()) {
        if (run.type === "input") {
			run.inputs = {
				mainInput: "Hello World!"
		    };
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		}
	}
})();

exadev.util.files.generateAndWriteCombinedMarkdown(mainBoard, undefined, "output");