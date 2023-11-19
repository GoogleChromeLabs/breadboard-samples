import { Board } from "@google-labs/breadboard";
import path from "path";
import exadev from "@exadev/breadboard-kits";

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});
const input = board.input();

const outputOne = board.output();
const outputTwo = board.output();

input.wire("parteOne", outputOne);
input.wire("partTwo", outputTwo);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				parteOne: `Hello Part One!`,
				partTwo: `Hello Part Two!`,
			};
		} else if (run.type === "output") {
			console.log(run.outputs);
		}
	}
})();

exadev.util.files.generateAndWriteCombinedMarkdown(board, undefined, "src");
