#!/usr/bin/env npx -y tsx

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";
import fs from "fs";
import * as url from "url";

const board = new Board({
	title: "Arrow Directions",
});

const output = board.output();

const input = board.input();

input.wire("inputPartOne", output); // Left-to-right direction is assumed by default

input.wire("inputPartTwo->", output);

output.wire("<-inputPartThree", input);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				inputPartOne: "Welcome",
				inputPartTwo: "To",
				inputPartThree: "Breadboard!",
			};
		} else if (run.type === "output") {
			console.log(run.outputs);
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
