import { Board } from "@google-labs/breadboard";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";

const board = new Board({
	title: "Hello World"
});

(async () => {
	board.input().wire("*", board.output());
	console.log(
		await board.runOnce({
			message: "Hello Breadboard!",
		})
	);
})();

import * as url from 'url';

generateAndWriteCombinedMarkdown({
	board,
	filename: "README",
	dir: url.fileURLToPath(new URL('.', import.meta.url))
});