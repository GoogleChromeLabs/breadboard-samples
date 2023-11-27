import {
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	ListKit,
} from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard";
import Core from "@google-labs/core-kit";
import { ClaudeKitBuilder } from "~/breadboard/ClaudeKitBuilder.ts";

export function makeBoard(): Board {
	const board = new Board();
	//////////////////////////////////////////////
	const hnFirebaseKit = board.addKit(HackerNewsFirebaseKit);
	const core = board.addKit(Core);
	const listKit = board.addKit(ListKit);
	const claudeKit = board.addKit(ClaudeKitBuilder);
	//////////////////////////////////////////////
	const hackerNewsTopStoryIdList = core.passthrough();
	hnFirebaseKit.topStoryIds().wire("storyIds", hackerNewsTopStoryIdList);

	const popStory = listKit.pop({
		$id: "popStoryId",
	});
	hackerNewsTopStoryIdList.wire("storyIds->list", popStory);
	popStory.wire("->list", popStory);
	const storyId = core.passthrough();
	popStory.wire("item->id", storyId);

	storyId.wire(
		"id",
		board.output({
			$id: "storyId",
		})
	);

	//////////////////////////////////////////////

	const hnAlgoliaKit = board.addKit(HackerNewsAlgoliaKit);

	const getStoryFromId = hnAlgoliaKit.getStory();
	storyId.wire("id", getStoryFromId);
	const story = core.passthrough();

	getStoryFromId.wire("*", story);
	story.wire(
		"*",
		board.output({
			$id: "fullStory",
		})
	);

	const storyOutput = board.output({
		$id: "story",
	});

	story.wire("algoliaUrl", storyOutput);
	story.wire("author", storyOutput);
	story.wire("children", storyOutput);
	story.wire("created_at", storyOutput);
	story.wire("created_at_i", storyOutput);
	// story.wire("id", storyOutput);
	story.wire("points", storyOutput);
	story.wire("story_id", storyOutput);
	story.wire("title", storyOutput);
	// story.wire("type", storyOutput);
	story.wire("url", storyOutput);

	//////////////////////////////////////////////
	const countTokens = claudeKit.countTokens({
		$id: "countTokens",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum metus magna, eu efficitur enim maximus vel. Sed sit amet pulvinar neque. Etiam facilisis enim dui, ac aliquet ante pulvinar eget. Maecenas sodales scelerisque porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed commodo placerat blandit. In id massa ut libero molestie laoreet id a enim. Aliquam erat volutpat. Duis efficitur ante eros, non sodales neque faucibus id. Fusce cursus porta sem, ac consectetur felis porttitor non. Proin tincidunt a eros dictum fermentum. Praesent nec faucibus sapien, cursus eleifend lorem.",
	});
	countTokens.wire(
		"*",
		board.output({
			$id: "tokenCount",
		})
	);

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

	return board;
}
