#!/usr/bin/env npx -y tsx
import { makeBoard } from "./board";
import { generateAndWriteCombinedMarkdown } from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import * as url from 'url';
import path from "path";
import fs from "fs";

import {makeMarkdown} from "@exadev/breadboard-kits/util/files/makeMarkdown"
import {MarkdownContentType} from "@exadev/breadboard-kits/types/markdown"


const board = makeBoard()

generateAndWriteCombinedMarkdown({
	board: board,
	filename: "README",
	title:"title",
	dir: "./"
});


const blogUrl = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"

for await (const runResult of board.run({
	// probe:new LogProbe(),
})) {
	console.log("=".repeat(80));
	console.log(runResult.node.id);
	if (runResult.type === "input") {
		if (runResult.node.id == "promptDetails"){
			const instruction = "Based on this summary and original text, give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output: ";

			runResult.inputs = {
				template: [instruction, "{{summary}}", "the original text is the following: ", "{{blogContent}}", ].join("/n")
			}
		} else {
			console.log("runResult.state.newOpportunities", runResult.state.newOpportunities);
			console.log("runResult.inputArguments", runResult.inputArguments);
		}

	
	} else if (runResult.type === "output") {
		const outputs = runResult.outputs

		console.log("outputs", outputs);

		const outputBuffer = [];
		outputBuffer.push({ url: blogUrl, ...outputs });

		const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
		const outputDir = path.join(__dirname, "outputs")
		fs.mkdirSync(outputDir, { recursive: true });

		// write all outputs into 1 file, summarising the whole process
		fs.writeFileSync(path.join(outputDir, "blog_summary.json"), JSON.stringify(outputBuffer, null, 2));
	}
}
