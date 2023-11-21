import { Board } from "@google-labs/breadboard";
import path from "path";
import {makeMarkdown} from "@exadev/breadboard-kits/dist/util/files/makeMarkdown.js"
import {MarkdownContentList, MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
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

const markdownConfig : MarkdownContentList = [MarkdownContentType.mermaid, MarkdownContentType.json]
const filename = board.title
const title = board.title
const dir = "output"

makeMarkdown({board, filename, title, dir, markdownConfig});