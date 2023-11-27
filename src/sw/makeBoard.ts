import { Board } from "@google-labs/breadboard";
import {
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	ListKit,
} from "@exadev/breadboard-kits";
import Core from "@google-labs/core-kit";

export function makeBoard(): Board {
	const board = new Board();
	//////////////////////////////////////////////
	const hnFirebaseKit = board.addKit(HackerNewsFirebaseKit);
	const core = board.addKit(Core);
	const listKit = board.addKit(ListKit);
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
	return board;
}
