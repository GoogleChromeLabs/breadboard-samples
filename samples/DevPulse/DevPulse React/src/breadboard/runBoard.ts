#!/usr/bin/env npx -y tsx

type Receiver = {
	log: (...args: unknown[]) => void;
};
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board, LogProbe } from "@google-labs/breadboard";
import { handleBoardOutput } from "./boardOutputHandler";
import { makeBoard } from "./makeBoard";

const board: Board = makeBoard();
const logReceiver: Receiver = { log: (message) => console.debug(message) };

const ignoredOutputNodeIds = [
	"testCompletion",
	"algoliaSearchUrl",
	"postSummarisation",
];

generateAndWriteCombinedMarkdown({
	board,
	title: "DevPulse",
	filename: "./README",
	dir: "./",
});

for await (const runResult of board.run({
	probe: new LogProbe(),
	// probe: new LogProbe(logReceiver),
})) {
	if (runResult.type === "input") {
		if (runResult.node.id === "claudeApiKey") {
			runResult.inputs = {
				apiKey: "REPLACE_ME", // <--------------------------------------
			};
		} else if (runResult.node.id === "searchQuery") {
			runResult.inputs = {
				query: "test",
			};
		} else {
			console.log("input", runResult.node.id);
		}
	}
	if (runResult.type === "output") {
		handleBoardOutput({
			node: runResult.node,
			outputs: runResult.outputs,
			state: runResult.state,
		});

		console.log("output", runResult.node.id, runResult.outputs);
		if (runResult.outputs?.story_id) {
			//
		} else if (ignoredOutputNodeIds.includes(runResult.node.id)) {
			//
		} else {
			console.debug("id", runResult.node.id, "output", runResult.outputs);
			throw new Error(`node: ${runResult.node.id}`);
		}
	}
}
