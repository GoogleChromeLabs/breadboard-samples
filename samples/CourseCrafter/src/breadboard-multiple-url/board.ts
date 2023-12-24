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
					type: "list",
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

	const getContent = courseCraftKit.getBlogsContent({ $id: "getBlogsContent" });
	const pipeline = xenovaKit.pipelineBulk({ $id: "summaryLanguageModel" });
	const instructionTemplate = stringKit.template({$id: "claudePromptConstructor"});	
	
	templateInput.wire("->template", instructionTemplate);
	input.wire("->list", getContent);
	taskDetails.wire("->model", pipeline);
	taskDetails.wire("->task", pipeline);
	
	// wire blog content into xenova pipeline
	getContent.wire("blogOutput->inputs", pipeline);

	getContent.wire("blogOutput->blogContents", instructionTemplate);
	pipeline.wire("summaries->summaries", instructionTemplate);

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