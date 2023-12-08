import { CourseCrafterKit, StringKit, XenovaKit } from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";
import { config } from "dotenv";
import { Starter} from "@google-labs/llm-starter";
import { Core } from "@google-labs/core-kit";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import fs from "fs";

const board = new Board({
	title: "CourseCrafter",
});

const courseCraftKit = board.addKit(CourseCrafterKit);
const xenovaKit = board.addKit(XenovaKit);
const claudeKit = board.addKit(ClaudeKit);
const stringKit = board.addKit(StringKit);
const core = board.addKit(Core);
const starter = board.addKit(Starter);
config();

const input = board.input({
	$id: "blogDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "string",
				title: "Text",
				description: "urls",
			},
		},
	},
});

const templateInput = board.input({
	$id: "promptDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "string",
				title: "Text",
				description: "urls",
			},
		},
	},
});


const taskDetails = board.input({
	$id: "taskDetails",
	schema: {
		type: "object",
		properties: {
			text: {
				type: "string",
				title: "Text",
				description: "model and task",
			},
		},
	},
});

const getBlogContentForTask = courseCraftKit.getBlogContentForTask({ $id: "getBlogContents" });
const pipeline = xenovaKit.pipeline({ $id: "summaryLanguageModel" });
// const output = board.output({ $id: "outputSummary" });

const instruction = "Based on this summary and original text, give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output: ";
const instructionTemplate = stringKit.template({
	$id: "claudePromptConstructor",
	template: [instruction, "{{summary}}", "the original text is the following: ", "{{blogContent}}", ].join("/n"),
});

templateInput.wire("->template", instructionTemplate);
input.wire("->url", getBlogContentForTask);
taskDetails.wire("->model", getBlogContentForTask);
taskDetails.wire("->task", getBlogContentForTask);

// wire blog content into xenova pipeline
getBlogContentForTask.wire("blogContent->input", pipeline);
getBlogContentForTask.wire("model->model", pipeline);
getBlogContentForTask.wire("task->task", pipeline);
// use passthrough to collect all outputs of previous nodes/kits
const allOutputs = board.output({ $id: "outputCollector" });

getBlogContentForTask.wire("blogContent->blogContent", instructionTemplate);
pipeline.wire("output->summary", instructionTemplate);
getBlogContentForTask.wire("blogContent->blogContent", allOutputs);
pipeline.wire("output->blogSummary", allOutputs);

const secrets = starter.secrets(["CLAUDE_API_KEY"]);
const serverUrl = "https://api.anthropic.com/v1/complete";
const claudeParams = {
	model: "claude-2",
	url: `${serverUrl}`,
};

const claudeCompletion = claudeKit.generateCompletion({
	$id: "claudeAPI",
	...claudeParams,
});

secrets.wire("CLAUDE_KEY->apiKey", claudeCompletion);
instructionTemplate.wire("string->userQuestion", claudeCompletion);
instructionTemplate.wire("string->userQuestion", allOutputs);
claudeCompletion.wire("completion->claudeResponse", allOutputs);
// allOutputs.wire("*", output)

// makeMarkdown({ board, filename: board.title, title: board.title, dir: "./tests/kits/courseCrafterKit", markdownConfig: [MarkdownContentType.mermaid, MarkdownContentType.json] });

generateAndWriteCombinedMarkdown({
	board: board,
	filename: "README",
	dir: "./",
})
// const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"

// const result = await board.runOnce({
// 	url: blogURL,
// 	model: "Xenova/distilbart-cnn-6-6",
// 	task: "summarization",
// });

// const outputBuffer = [];
// outputBuffer.push({ url: blogURL, ...result });

// import * as url from 'url';
// import path from "path";
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const outputDir = path.join(__dirname,"outputs")
// fs.mkdirSync(outputDir, { recursive: true });

// write all outputs into 1 file, summarising the whole process
// fs.writeFileSync(path.join(outputDir, "blog_summary.json"), JSON.stringify(outputBuffer, null, 2));
// this prompt returns text in markdown format
// fs.writeFileSync(path.join(outputDir, "code.md"), result["claudeResponse"] as string);

export default board;
export { board };