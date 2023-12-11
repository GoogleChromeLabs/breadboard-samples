#!/usr/bin/env npx -y tsx watch
import { hackerNewsBoard } from "./hackerNewsBoard.js";

import {makeMarkdown} from "@exadev/breadboard-kits/dist/types/makeMarkdown.js"
import {MarkdownContentType} from "@exadev/breadboard-kits/dist/types/markdown.js"
////////////////////////////////////////////////

makeMarkdown({
	board: hackerNewsBoard,
	filename: "README",
	title: "Hacker News",
	dir: ".",
	markdownConfig: [
		MarkdownContentType.mermaid,
		MarkdownContentType.json
	]
});

const suppressedOutputIds = [
	"commentOutput",
	"fullCommentData"
];

for await (const run of hackerNewsBoard.run({
	// probe: new LogProbe(),
})) {
	if (run.type == "output") {
		if (suppressedOutputIds.includes(run.node.id)) {
			continue;
		}
		console.log(run.node.id, run.outputs);
	}
}
