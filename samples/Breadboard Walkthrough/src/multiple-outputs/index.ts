import { Board } from "@google-labs/breadboard";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";

const board = new Board({
	title: "Multiple Outputs"
});
const outputOne = board.output({
	$id: "outputOne",
});
const outputTwo = board.output({
	$id: "outputTwo",
});

const input = board.input();

input.wire("partOne", outputOne);
input.wire("partTwo", outputTwo);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				partOne: `Hello Input Part One`,
				partTwo: `Hello Input Part Two`,
			};
		} else if (run.type === "output") {
			if (run.node.id === "outputOne") {
				console.log("outputOne", JSON.stringify(run.outputs, null, 2));
			} else if (run.node.id === "outputTwo") {
				console.log("outputTwo", JSON.stringify(run.outputs, null, 2));
			}
		}
	}
})();

import * as url from 'url';

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL('.', import.meta.url))
});