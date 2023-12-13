import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";
import * as url from "url";

const board = new Board({
	title: "Multiple Inputs",
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

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL(".", import.meta.url)),
});
