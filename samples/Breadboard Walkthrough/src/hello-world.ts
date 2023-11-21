import { Board } from "@google-labs/breadboard";
import path from "path";
import {makeMarkdown} from "@exadev/breadboard-kits/dist/util/files/makeMarkdown.js"
import {MarkdownContentList, MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});

(async () => {
	board.input().wire("*", board.output());
	console.log(
		await board.runOnce({
			message: "Hello Breadboard!",
		})
	);
})();

makeMarkdown({
	board: board,
	filename: board.title,
	title: board.title,
	dir: "output",
	markdownConfig: [
		MarkdownContentType.mermaid,
		MarkdownContentType.json
	]
});