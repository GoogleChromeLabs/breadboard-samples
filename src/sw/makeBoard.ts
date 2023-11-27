import { Board } from "@google-labs/breadboard";

export function makeBoard(): Board {
	const board = new Board();
	const input1 = board.input({ $id: "input1" });
	const input2 = board.input({ $id: "input2" });

	const output1 = board.output({ $id: "output1" });
	input1.wire("msgOne", output1);

	const output2 = board.output({ $id: "output2" });
	input2.wire("msgTwo", output2);

	const combinedOutput = board.output({ $id: "combinedOutput" });
	input1.wire("msgOne->partOne", combinedOutput);
	input2.wire("msgTwo->partTwo", combinedOutput);

	return board;
}
