import { Board } from "@google-labs/breadboard";
import exadev from "@exadev/breadboard-kits";
import path from "path";

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});

const output = board.output();

const inputOne = board.input();
inputOne.wire("message", output);

const inputTwo = board.input();
inputTwo.wire("message", output);

let counter = 1;

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				message: `Hello Input ${counter++}!`,
			};
		} else if (run.type === "output") {
			console.log(run.outputs);
		}
	}
})();

exadev.util.files.generateAndWriteCombinedMarkdown(board, undefined, "output");
