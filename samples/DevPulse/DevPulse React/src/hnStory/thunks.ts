import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoryOutput } from "~/hnStory/domain";
import { Stories } from "~/core/Stories";
import { Board, LogProbe } from "@google-labs/breadboard";
import { makeBoard } from "~/breadboard/makeBoard";

type Receiver = {
	log: (...args: unknown[]) => void;
};

const board: Board = makeBoard();
const logReceiver: Receiver = { log: (message) => console.debug(message) };

const ignoredOutputNodeIds = [
	"testCompletion",
	"algoliaSearchUrl",
	"postSummarisation",
];

export const getStories = createAsyncThunk<
	StoryOutput[],
	void
>("stories/getStories", async () => {
	for await (const runResult of board.run({
		// probe: new LogProbe(),
		probe: new LogProbe(logReceiver),
	})) {
		if (runResult.type === "input") {
			if (runResult.node.id === "claudeApiKey") {
				runResult.inputs = {
					apiKey: "***REMOVED***"
				};
			} else if (runResult.node.id === "searchQuery") {
				runResult.inputs = {
					query: "news",
				};
			} else {
				console.log("input", runResult.node.id);
			}
		}
		if (runResult.type === "output") {
			console.log("output", runResult.node.id, runResult.outputs);
			if (runResult.outputs?.story_id) {
				const id = runResult.outputs.story_id as number;
				Stories.add(id, runResult.outputs);
				console.log("StoryLibrary", Stories.getAll());
			} else if (ignoredOutputNodeIds.includes(runResult.node.id)) {
				//
			} else {
				console.debug("id", runResult.node.id, "output", runResult.outputs);
				throw new Error(`node: ${runResult.node.id}`);
			}
		}
	}
	const response = Stories.getAll() as unknown[] as StoryOutput[];
	return response;
});