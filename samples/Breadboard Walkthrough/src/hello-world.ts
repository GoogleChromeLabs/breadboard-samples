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


const markdownConfig : MarkdownContentList = [MarkdownContentType.mermaid, MarkdownContentType.json]
const filename = board.title
const title = board.title
const dir = "output"

makeMarkdown({board, filename, title, dir, markdownConfig});