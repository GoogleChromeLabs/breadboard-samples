#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";
import path from "path";
import exadev from "@exadev/breadboard-kits";
import { Core } from "@google-labs/core-kit"

const board = new Board({
    title: path.basename(new URL(import.meta.url).pathname),
});

const core = board.addKit(Core);

const input = board.input({
	$id: "inputNode"
});

/* In this example, the wiring parameter names are identical on either side. This means the following lines are equivalent:
	1) Wiring parameter named on both sides of arrow
		input.wire("inputPartOne->inputPartOne", board.output());
	2) Wiring parameter named on left side of arrow
		input.wire("inputPartOne->", board.output());
	3) Wiring parameter named on right side of arrow
		input.wire("->inputPartOne", board.output());
	4) Wiring parameter named without arrow direction (which assumes left-to-right direction by default)
		input.wire("inputPartOne", board.output());
*/
input.wire("inputPartOne", board.output({
        $id: "outputNode"
}));

// Redirecting a parameter to another name can be useful for when you want to use a node that requires a specifically named input or input(s)
input.wire("inputPartTwo->renamedOutput", board.output({
	$id: "renamedOutputNode"
}));

input.wire("*", board.output({
	$id: "outputAll"
}));

(async () => {
	for await (const run of board.run()) {
        if (run.type === "input") {
			run.inputs = {
				inputPartOne: "Hello",
				inputPartTwo: "World!"
		    };
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		}
	}
})();

exadev.util.files.generateAndWriteCombinedMarkdown(board, undefined, "output");