import {
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	JsonKit,
	ListKit,
	ObjectKit,
	StringKit,
} from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit";
import { ClaudeKitBuilder } from "~/breadboard/ClaudeKitBuilder.ts";

const LIMIT = 10;
const DEBUG = false;
export function makeBoard(): Board {
	const board = new Board();
	//////////////////////////////////////////////
	const hnFirebaseKit = board.addKit(HackerNewsFirebaseKit);
	const core = board.addKit(Core);
	const listKit = board.addKit(ListKit);
	const claudeKit = board.addKit(ClaudeKitBuilder);
	const objectKit = board.addKit(ObjectKit);
	//////////////////////////////////////////////
	const hackerNewsTopStoryIdList = core.passthrough();
	hnFirebaseKit
		.topStoryIds({
			limit: 1,
		})
		.wire("storyIds", hackerNewsTopStoryIdList);

	const popStory = listKit.pop({
		$id: "popStoryId",
	});
	hackerNewsTopStoryIdList.wire("storyIds->list", popStory);
	popStory.wire("->list", popStory);
	const storyId = core.passthrough();
	popStory.wire("item->id", storyId);

	if (DEBUG) {
		storyId.wire(
			"id",
			board.output({
				$id: "storyId",
			})
		);
	}

	//////////////////////////////////////////////

	const hnAlgoliaKit = board.addKit(HackerNewsAlgoliaKit);

	const getStoryFromId = hnAlgoliaKit.getStory();
	storyId.wire("id", getStoryFromId);
	const story = core.passthrough();

	getStoryFromId.wire("*", story);
	if (DEBUG) {
		story.wire(
			"*",
			board.output({
				$id: "fullStory",
			})
		);
	}

	if (DEBUG) {
		const storyOutput = board.output({
			$id: "story",
		});

		story.wire("algoliaUrl", storyOutput);
		story.wire("author", storyOutput);
		// story.wire("children", storyOutput);
		story.wire("created_at", storyOutput);
		story.wire("created_at_i", storyOutput);
		// story.wire("id", storyOutput);
		story.wire("points", storyOutput);
		story.wire("story_id", storyOutput);
		story.wire("title", storyOutput);
		// story.wire("type", storyOutput);
		story.wire("url", storyOutput);
	}

	//////////////////////////////////////////////

	// const countTokens = claudeKit.countTokens({
	// 	$id: "countTokens",
	// 	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum metus magna, eu efficitur enim maximus vel. Sed sit amet pulvinar neque. Etiam facilisis enim dui, ac aliquet ante pulvinar eget. Maecenas sodales scelerisque porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed commodo placerat blandit. In id massa ut libero molestie laoreet id a enim. Aliquam erat volutpat. Duis efficitur ante eros, non sodales neque faucibus id. Fusce cursus porta sem, ac consectetur felis porttitor non. Proin tincidunt a eros dictum fermentum. Praesent nec faucibus sapien, cursus eleifend lorem.",
	// });
	// countTokens.wire(
	// 	"*",
	// 	board.output({
	// 		$id: "tokenCount",
	// 	})
	// );

	//////////////////////////////////////////////
	const claudeApiKey = board.input({
		$id: "claudeApiKey",
	});

	const VITE_SERVER_PORT = 5173;
	const serverUrl = `http://localhost:${VITE_SERVER_PORT}`;
	const claudeParams = {
		model: "claude-2",
		userQuestion: "What is the meaning of life?",
		url: `${serverUrl}/anthropic/v1/complete`,
	};
	const claudeCompletion = claudeKit.complete({
		$id: "claudeCompletion",
		...claudeParams,
	});
	claudeApiKey.wire("apiKey", claudeCompletion);

	claudeCompletion.wire("*", board.output({ $id: "completion" }));

	//////////////////////////////////////////////

	const jsonKit = board.addKit(JsonKit);
	const stringifiedPost = jsonKit.stringify();

	const nest = objectKit.nest({
		key: "story",
	});
	story.wire("*", nest);

	if (LIMIT) {
		const objectKit = board.addKit(ObjectKit);
		const limit = objectKit.limitDepth({
			depth: 10,
		});
		nest.wire("story->object", limit);
		limit.wire("object", stringifiedPost);
	} else {
		story.wire("story->object", stringifiedPost);
	}
	if (DEBUG) {
		stringifiedPost.wire("string", board.output({ $id: "json" }));
	}

	//////////////////////////////////////////////
	const string = board.addKit(StringKit);

	const instruction = "Summarise the discussion regarding this post";

	const instructionTemplate = string.template({
		$id: "instructionTemplate",
		template: [instruction, "```json", "{{story}}", "```"].join("\n"),
	});
	stringifiedPost.wire("string->story", instructionTemplate);

	if (DEBUG) {
		instructionTemplate.wire(
			"string",
			board.output({
				$id: "populatedTemplate",
			})
		);
	}

	const claudePostSummarisation = claudeKit.complete({
		$id: "claudePostSummarisation",
		model: "claude-2",
		url: `${serverUrl}/anthropic/v1/complete`,
	});

	claudeApiKey.wire("apiKey.", claudePostSummarisation);
	instructionTemplate.wire("string->userQuestion", claudePostSummarisation);

	// claudePostSummarisation.wire(
	// 	"*",
	// 	board.output({
	// 		$id: "postSummarisation",
	// 	})
	// );

	const storyData = core.passthrough();

	story.wire("story_id", storyData);

	story.wire("title", storyData);

	story.wire("url", storyData);

	const hnUrl = string.template({
		template: "https://news.ycombinator.com/item?id={{story_id}}",
	});
	story.wire("story_id", hnUrl);
	hnUrl.wire("string->post_url", storyData);

	storyData.wire(
		"*",
		board.output({
			$id: "storyData",
		})
	);
	//////////////////////////////////////////////
	const summary = core.passthrough();
	storyData.wire("story_id", summary);
	storyData.wire("title", summary);
	storyData.wire("url", summary);
	storyData.wire("post_url", summary);

	claudePostSummarisation.wire("completion", summary);
	if (DEBUG) {
		claudePostSummarisation.wire("stop_reason", summary);
		claudePostSummarisation.wire("model", summary);
		claudePostSummarisation.wire("stop", summary);
		claudePostSummarisation.wire("log_id", summary);
	}
	storyData.wire("*", summary);

	summary.wire(
		"*",
		board.output({
			$id: "summary",
		})
	);

	return board;
}
