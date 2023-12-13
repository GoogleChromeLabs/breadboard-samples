#!/usr/bin/env npx -y tsx

import writeMarkdown from "@exadev/breadboard-kits/util/files/writeMarkdown";
import { asRuntimeKit, Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import * as url from "url";
import fs from "fs";

(async () => {
	const BASE = "https://raw.githubusercontent.com";
	const OWNER = "ExaDev-io";
	const REPO = "breadboard-samples";
	const BRANCH = "develop";
	const PATH =
		"samples/Breadboard%20Walkthrough/src/adding-slot-to-a-board-with-url";

	const MAIN_BOARD_URL = [
		BASE,
		OWNER,
		REPO,
		BRANCH,
		PATH,
		"mainboard.json",
	].join("/");

	const NESTED_BOARD_URL = [
		BASE,
		OWNER,
		REPO,
		BRANCH,
		PATH,
		"nestedboard.json",
	].join("/");

	const nested = await Board.load(NESTED_BOARD_URL);

	const board = await Board.load(MAIN_BOARD_URL, {
		slotted: { nested },
	});

	writeMarkdown({
		filename: "README",
		markdown: ["```mermaid", `${board.mermaid()}`, "```"].join("\n"),
		dir: url.fileURLToPath(new URL(".", import.meta.url)),
	});

	for await (const run of board.run({
		slots: {},
		kits: [asRuntimeKit(Core)], // The kit needs to be passed because the JSON only contains an identifier of the kit and not the logic
	})) {
		if (run.type === "input") {
			run.inputs = {
				mainInput: "Hello World!",
			};
		} else if (run.type === "output") {
			console.log(run.node.id, run.outputs);
		}
	}

	fs.writeFileSync(
		url.fileURLToPath(new URL("board.json", import.meta.url)),
		JSON.stringify(board, null, "\t")
	);
})();
