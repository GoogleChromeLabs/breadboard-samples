import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board } from "@google-labs/breadboard";

const board = new Board({
	title: "AutoBake",
});

board.input().wire(
	"*",
	board.output({
		message: "Hello World",
	})
);

generateAndWriteCombinedMarkdown({
	board,
	title: "DevPulse",
	filename: "./README",
	dir: "./",
});

export default board;
