#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import fs from "fs";
import * as url from "url";
import writeMarkdown from "@exadev/breadboard-kits/util/files/writeMarkdown";
import path from "path";

(async () => {
	const main: Board = new Board({
		title: "Adding Slot to a Board",
	});

	const core = main.addKit(Core);

	main
		.input({
			$id: "mainInputNode",
		})
		.wire(
			"mainInput->nestedInput",
			core
				.slot({ slot: "nested" })
				.wire(
					"nestedOutput",
					main.output({ $id: "mainOutputNode" })
				)
		);

	const nested = new Board({
		title: "Nested Board to be Slotted",
	});

	nested
		.input({
			$id: "nestedInputNode",
		})
		.wire(
			"nestedInput->nestedOutput",
			nested.output({ $id: "nestedOutputNode" })
		);

	const filepath = path.resolve("mainboard.json");
	fs.writeFileSync(filepath, JSON.stringify(main, null, "\t"));

	const board = await Board.load(filepath, {
		slotted: { nested }
	});

	writeMarkdown({
		filename: "README",
		markdown: ["```mermaid", `${board.mermaid()}`, "```"].join("\n"),
		dir: url.fileURLToPath(new URL(".", import.meta.url)),
	});

	for await (const runResult of board.run({
		slots: {},
		kits: [core],
	})) {
		if (runResult.type === "input") {
			runResult.inputs = {
				mainInput: "Hello World!",
			};
		} else if (runResult.type === "output") {
			console.log(runResult.node.id, runResult.outputs);
		}
	}
})();