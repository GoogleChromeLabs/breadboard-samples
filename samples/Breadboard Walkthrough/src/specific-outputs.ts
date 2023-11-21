import { Board } from "@google-labs/breadboard";
import path from "path";
import {makeMarkdown} from "@exadev/breadboard-kits/dist/util/files/makeMarkdown.js"
import {MarkdownContentList, MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});
const input = board.input();

const outputOne = board.output({
	$id: "output1",
});

const outputTwo = board.output({
	$id: "output2",
});

input.wire("message", outputOne);
input.wire("message", outputTwo);

(async () => {
	let counter = 1;

	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				message: "Input Message " + counter++, // counter used to demonstrate single input is wired to multiple outputs
			};
		} else if (run.type === "output") {
			console.log("=".repeat(80)); // separate each output
			console.log(
				JSON.stringify(
					{
						node: run.node,
						outputs: run.outputs,
					},
					null,
					2
				)
			);
		}
	}
})();

makeMarkdown({
	board,
	filename: board.title,
	title: board.title,
	dir: "output",
	markdownConfig: [
		MarkdownContentType.mermaid,
		MarkdownContentType.json
	]
});