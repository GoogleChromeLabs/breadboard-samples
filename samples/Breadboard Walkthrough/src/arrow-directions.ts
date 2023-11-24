#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";

const board = new Board({
	title: "My First Board",
	description: "This is my first board",
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

board.output({
	$id: "partTwoOutputNode"
}).wire("outputPartTwo<-inputPartTwo", input)

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