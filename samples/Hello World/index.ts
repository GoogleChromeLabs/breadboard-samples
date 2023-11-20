import { Board } from "@google-labs/breadboard";

const board = new Board();

board.input().wire("message", board.output());

(async () => {
	console.log(
		await board.runOnce({
			message: "Hello Breadboard!",
		})
	);
})();
