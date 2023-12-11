import { CourseCrafterKit, StringKit, XenovaKit } from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";
import { config } from "dotenv";
import { Starter} from "@google-labs/llm-starter";

const board = new Board({
	title: "CourseCrafter",
});

const courseCraftKit = board.addKit(CourseCrafterKit);
const xenovaKit = board.addKit(XenovaKit);
const claudeKit = board.addKit(ClaudeKit);
const stringKit = board.addKit(StringKit);

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


export default board;
export { board };