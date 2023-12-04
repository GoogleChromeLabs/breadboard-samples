#!/usr/bin/env npx -y tsx

type Receiver = {
	log: (...args: unknown[]) => void;
};
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board, LogProbe } from "@google-labs/breadboard";
import { makeBoard } from "./makeBoard";

const board: Board = makeBoard();
const logReceiver: Receiver = { log: (message) => console.debug(message) };

class Stories {
	private static instance: Stories;

	private stories: Map<number, unknown> = new Map<number, unknown>();

	private constructor() {}
	public static getInstance(): Stories {
		if (!Stories.instance) {
			Stories.instance = new Stories();
		}
		return Stories.instance;
	}

	private get(id: number): unknown {
		return this.stories.get(id);
	}
	private add(
		id: number,
		story: {
			[key: string]: unknown;
		}
	): void {
		this.stories.set(id, {
			...(this.stories.get(id) || {}),
			...story,
		});
	}
	static get(id: number): unknown {
		return Stories.getInstance().get(id);
	}
	static add(
		id: number,
		story: {
			[key: string]: unknown;
		}
	): void {
		Stories.getInstance().add(id, story);
	}
	static getAll(): unknown[] {
		return Array.from(Stories.getInstance().stories.values());
	}
}

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
	// probe: new LogProbe(),
	probe: new LogProbe(logReceiver),
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
console.log(Stories.getAll());
