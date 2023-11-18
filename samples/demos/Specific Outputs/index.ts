import { Board } from "@google-labs/breadboard";

const board = new Board();

const input = board.input();

const outputOne = board.output({
	$id: "output1",
});

const outputTwo = board.output({
	$id: "output2",
});

input.wire("message", outputOne);
input.wire("message", outputTwo);

(async () => {
	let counter = 1;

	for await (const run of board.run()) {
		if (run.type === "input") {
			run.inputs = {
				message: "Input Message " + counter++, // counter used to demonstrate single input is wired to multiple outputs
			};
		} else if (run.type === "output") {
			console.log("=".repeat(80)); // separate each output
			console.log(
				JSON.stringify(
					{
						node: run.node,
						outputs: run.outputs,
					},
					null,
					2
				)
			);
		}
	}
})();
