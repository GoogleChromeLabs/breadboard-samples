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

const LIMIT_DEPTH = 3;
const SEARCH_RESULT_COUNT = 10;

const DEBUG = false;
const TOP_STORIES = false;
export function makeBoard(): Board {
	const board = new Board();
	//////////////////////////////////////////////
	const hnFirebaseKit = board.addKit(HackerNewsFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
	const core = board.addKit(Core);
	const listKit = board.addKit(ListKit);
	const claudeKit = board.addKit(ClaudeKitBuilder);
	const objectKit = board.addKit(ObjectKit);
	const stringKit = board.addKit(StringKit);
	//////////////////////////////////////////////
	const searchQuery = board.input({
		$id: "searchQuery",
	});

	const search = algolia.search({
		tags: ["story"],
		limit: SEARCH_RESULT_COUNT,
	});
	const searchPassthrough = core.passthrough();
	searchQuery.wire("query", searchPassthrough);
	searchPassthrough.wire("*", search);

	const queryOutput = board.output({ $id: "algoliaSearchUrl" });
	search.wire("algoliaUrl", queryOutput);
	searchQuery.wire("query", queryOutput);

	//////////////////////////////////////////////
	if (DEBUG) {
		search.wire(
			"hits",
			board.output({
				$id: "searchResults",
			})
		);
	}
	const popSearchResult = listKit.pop({
		$id: "popSearchResult",
	});

	// const result = {
	// 	// object: {
	// 	storyid: "asdkjahsdkjash",
	// 	created_at: "2021-08-01T00:00:00.000Z",
	// 	// }
	// }

	search.wire("hits->list", popSearchResult);
	popSearchResult.wire("list", popSearchResult);
	const searchResult = objectKit.spread({
		$id: "searchResult",
	});
	popSearchResult.wire("item->object", searchResult);
	const searchResultOutput = board.output({
		$id: "searchResultData",
	});
	searchResult.wire("story_id", searchResultOutput);
	searchResult.wire("title", searchResultOutput);
	searchResult.wire("url", searchResultOutput);
	searchResult.wire("author", searchResultOutput);
	searchResult.wire("created_at", searchResultOutput);
	searchResult.wire("created_at_i", searchResultOutput);
	searchResult.wire("points", searchResultOutput);
	searchResult.wire(
		"story_id",
		stringKit
			.template({
				template: "https://news.ycombinator.com/item?id={{story_id}}",
			})
			.wire("string->hnURL", searchResultOutput)
	);

	//////////////////////////////////////////////
	const popStory = listKit.pop({
		$id: "popStoryId",
	});
	if (TOP_STORIES) {
		const hackerNewsTopStoryIdList = core.passthrough();
		hnFirebaseKit
			.topStoryIds({
				limit: 1,
			})
			.wire("storyIds", hackerNewsTopStoryIdList);

		hackerNewsTopStoryIdList.wire("storyIds->list", popStory);
	}
	popStory.wire("list", popStory);
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
	searchResult.wire("story_id->id", storyId);
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

	const storyOutput = board.output({
		$id: "story",
	});

	story.wire("algoliaUrl", storyOutput);
	story.wire("author", storyOutput);
	story.wire("created_at", storyOutput);
	story.wire("created_at_i", storyOutput);
	// story.wire("id", storyOutput);
	story.wire("points", storyOutput);
	story.wire("story_id", storyOutput);
	story.wire("title", storyOutput);
	story.wire("type", storyOutput);
	story.wire("url", storyOutput);
	search.wire("algoliaUrl", storyOutput);
	searchQuery.wire("query", storyOutput);

	if (DEBUG) {
		story.wire("children", storyOutput);
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
	/* const claudeParams = {
		model: "claude-2",
		userQuestion: "Tell me a joke about a software engineer",
		url: `${serverUrl}/anthropic/v1/complete`,
	};
	const claudeCompletion = claudeKit.complete({
		$id: "claudeCompletion",
		...claudeParams,
	});
	claudeApiKey.wire("apiKey", claudeCompletion);

	claudeCompletion.wire("*", board.output({ $id: "testCompletion" })); */

	//////////////////////////////////////////////

	const jsonKit = board.addKit(JsonKit);
	const stringifiedPost = jsonKit.stringify();

	const nest = objectKit.nest({
		key: "story",
	});
	story.wire("*", nest);

	if (LIMIT_DEPTH) {
		const objectKit = board.addKit(ObjectKit);
		const limit = objectKit.limitDepth({
			depth: LIMIT_DEPTH,
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

	const instruction = "Summarise the discussion regarding this post";
	const templateText = [instruction, "```json", "{{story}}", "```"].join(
		"\n"
	);

	story.wire(
		"story_id",
		board.output({
			$id: "templateText",
			instruction,
			templateText,
		})
	);

	const instructionTemplate = stringKit.template({
		$id: "instructionTemplate",
		template: templateText,
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

	story.wire(
		"story_id",
		board.output({
			$id: "pendingOutput",
			summary: "pending",
		})
	);

	const claudePostSummarisation = claudeKit.complete({
		$id: "claudePostSummarisation",
		model: "claude-2",
		url: `${serverUrl}/anthropic/v1/complete`,
	});

	claudeApiKey.wire("apiKey.", claudePostSummarisation);
	instructionTemplate.wire("string->userQuestion", claudePostSummarisation);

	const summaryOutput = board.output({
		$id: "summary",
	});

	story.wire("story_id", summaryOutput);
	claudePostSummarisation.wire("completion->summary", summaryOutput);
	claudePostSummarisation.wire("*", summaryOutput);
	return board;
}
