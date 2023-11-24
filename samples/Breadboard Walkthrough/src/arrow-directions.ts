#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";
import path from "path";
import exadev from "@exadev/breadboard-kits";

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
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
						inputPartThree: "Breadboard!"
			};
		} else if (run.type === "output") {
			console.log(run.outputs);
		}
	}
})();

exadev.util.files.generateAndWriteCombinedMarkdown(board, undefined, "output");