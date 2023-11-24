import { Board } from "@google-labs/breadboard";
import path from "path";
import {makeMarkdown} from "@exadev/breadboard-kits/dist/util/files/makeMarkdown.js"
import {MarkdownContentList, MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"

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