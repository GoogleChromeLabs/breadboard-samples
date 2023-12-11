import { CourseCrafterKit, StringKit, XenovaKit, ConfigKit} from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";


export function makeBoard(): Board{
	const board = new Board({
		title: "CourseCrafter",
	});
	
	const courseCraftKit = board.addKit(CourseCrafterKit);
	const xenovaKit = board.addKit(XenovaKit);
	const claudeKit = board.addKit(ClaudeKit);
	const stringKit = board.addKit(StringKit);
	const config = board.addKit(ConfigKit);

	
	
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
	const instructionTemplate = stringKit.template({$id: "claudePromptConstructor"});	
	
	templateInput.wire("->template", instructionTemplate);
	input.wire("->url", getBlogContentForTask);
	taskDetails.wire("->model", getBlogContentForTask);
	taskDetails.wire("->task", getBlogContentForTask);
	
	// wire blog content into xenova pipeline
	getBlogContentForTask.wire("blogContent->input", pipeline);
	getBlogContentForTask.wire("model->model", pipeline);
	getBlogContentForTask.wire("task->task", pipeline);

	getBlogContentForTask.wire("blogContent->blogContent", instructionTemplate);
	pipeline.wire("output->summary", instructionTemplate);

	const serverUrl = "https://api.anthropic.com/v1/complete";

	const claudeParams = {
		model: "claude-2",
		url: `${serverUrl}`,
	};

	const claudeCompletion = claudeKit.generateCompletion({
		$id: "claudeAPI",
		...claudeParams,
	});

	const claudeApiKey = config.readEnvVar({
		key: "CLAUDE_API_KEY",
	});

	claudeApiKey.wire("CLAUDE_API_KEY", claudeCompletion);
	instructionTemplate.wire("string->text", claudeCompletion);
	
	claudeCompletion.wire("completion->", board.output());

	return board
}
