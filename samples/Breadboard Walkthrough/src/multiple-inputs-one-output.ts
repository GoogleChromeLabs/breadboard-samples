import { Board } from "@google-labs/breadboard";
import path from "path";
import {makeMarkdown} from "@exadev/breadboard-kits/dist/util/files/makeMarkdown.js"
import {MarkdownContentList, MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});

const output = board.output();

const inputOne = board.input({
	$id: "inputOne",
});
inputOne.wire("partOne", output);

const inputTwo = board.input({
	$id: "inputTwo",
});
inputTwo.wire("partTwo", output);

(async () => {
	for await (const run of board.run()) {
		if (run.type === "input") {
			if (run.node.id === "inputOne") {
				run.inputs = {
					partOne: `Hello Input One`,
				};
			} else if (run.node.id === "inputTwo") {
				run.inputs = {
					partTwo: `Hello Input Two`,
				};
			}
		} else if (run.type === "output") {
			console.log(JSON.stringify(run.outputs, null, 2));
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