#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import path from "path";
import exadev from "@exadev/breadboard-kits";

const board = new Board({
    title: path.basename(new URL(import.meta.url).pathname),

});

const coreKit = board.addKit(Core);

const input = board.input({
	$id: "inputNode"
});

input.wire("inputPartOne", board.output({
        $id: "outputNode"
    }));

// redirecting a parameter to another name can be useful for when you want to use a node that requires a specifically named input or input(s)
input.wire("inputPartOne->outputPartOne", board.output({
	$id: "renamedOutputNode"
}));

input.wire("*", board.output({
		$id: "outputAll"
}));

(async () => {
	for await (const run of board.run()) {
        if (run.type === "input") {
					run.inputs = {
						inputPartOne: `Hello`,
						inputPartTwo: "World!"
			};
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		}
	}
})();

exadev.util.files.generateAndWriteCombinedMarkdown(board, undefined, "output");