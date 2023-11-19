import { Board } from "@google-labs/breadboard";
import exadev from "@exadev/breadboard-kits";
import path from "path";

const board = new Board({
	title: path.basename(new URL(import.meta.url).pathname),
});

(async () => {
	board.input().wire("*", board.output());
	console.log(
		await board.runOnce({
			message: "Hello Breadboard!",
		})
	);
})();

exadev.util.files.generateAndWriteCombinedMarkdown(board, undefined, "src");
