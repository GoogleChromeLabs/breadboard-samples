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

// if we get weird errors, check the blog still exists 
const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
const blogURL3 = "https://developer.chrome.com/blog/desktop-mode/"
const urls = [blogURL, blogURL2, blogURL3];

for await (const runResult of board.run({
})) {
	if (runResult.type === "input") {
		if(runResult.node.id == "blogDetails"){
			runResult.inputs = {
				list:urls
			}
		}
		else if (runResult.node.id == "taskDetails") {
			runResult.inputs = {
				model: "Xenova/distilbart-cnn-6-6",
				task: "summarization"
			}
		}
		else if (runResult.node.id == "promptDetails"){
			const prompt = ["Based these summaries of blog posts:", "{{summaries}}", "and the original text: ", "{{blogContents}}", "can you outline topics discussed in each blog? For each blog give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output. Separate discussed topics in bullet points."].join("/n")

			runResult.inputs = {
				template: prompt,
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
