#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";
import fs from "fs";
import * as url from "url";

const board = new Board({
	title: "Naming Wiring Parameters",
});

const input = board.input({
	$id: "inputNode",
});

/**
 * The following 4 wires are equivalent because the property names are the identical on both the sending and receiving nodes
 */
// This means the parameter name can be on both sides of the arrow...
input.wire(
	"inputPartOne->inputPartOne",
	board.output({
		$id: "outputNode",
	})
);
// Or either side of the arrow...
input.wire(
	"inputPartTwo->",
	board.output({
		$id: "outputNode",
	})
);
input.wire(
	"->inputPartThree",
	board.output({
		$id: "outputNode",
	})
);
// Or the arrow can be omitted entirely, which assumes left-to-right direction by default
input.wire(
	"inputPartFour",
	board.output({
		$id: "outputNode",
	})
);

// The right-to-left arrow direction can be used to pass values from nodes inside the wire function to outer nodes
// The arrow direction must be included here, but the parameter name can be on the left, right or both sides of the arrow
board
	.output({
		$id: "outputNode",
	})
	.wire("inputPartFive<-inputPartFive", input);

// Redirecting a parameter to another name can be useful for when you want to use a node that requires specifically named input(s)
input.wire(
	"inputPartSix->renamedOutput",
	board.output({
		$id: "renamedOutputNode",
	})
);

// Using asterisk (*) will wire all properties
input.wire(
	"*",
	board.output({
		$id: "outputAll",
	})
);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				inputPartOne: "Hello",
				inputPartTwo: "World",
				inputPartThree: "And",
				inputPartFour: "Welcome",
				inputPartFive: "To",
				inputPartSix: "Breadboard!",
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
