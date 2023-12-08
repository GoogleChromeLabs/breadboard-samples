import { Board } from "@google-labs/breadboard";

const board = new Board();
const input = board.input({ input: "input" });
const output = board.output({ output: "output" });
input.wire("*", output);

export default board;
export { board };
