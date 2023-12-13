#!/usr/bin/env npx -y tsx
import { makeBoard } from "./board";
import * as url from 'url';
import path from "path";
import fs from "fs";

import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";

const board = makeBoard()

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL('.', import.meta.url))
});




const blogUrl = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"

for await (const runResult of board.run({
})) {
	if (runResult.type === "input") {
		if(runResult.node.id == "blogDetails"){
			runResult.inputs = {
				url:blogUrl
			}
		}
		else if (runResult.node.id == "taskDetails") {
			runResult.inputs = {
				model: "Xenova/distilbart-cnn-6-6",
				task: "summarization"
			}
		}
		else if (runResult.node.id == "promptDetails"){
			const instruction = "Based on this summary and original text, give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output: ";

			runResult.inputs = {
				template: [instruction, "{{summary}}", "the original text is the following: ", "{{blogContent}}", ].join("/n"),
			}
		} 
	}
	else if (runResult.type === "output") {
		const outputs = runResult.outputs
	
		const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
		const outputDir = path.join(__dirname, "outputs")
		fs.mkdirSync(outputDir, { recursive: true });

		fs.writeFileSync(path.join(outputDir, "blog_summary.md"), outputs["completion"] as string);
	}
}
