import { Board } from "@google-labs/breadboard";
import { CourseCrafterKit } from "@exadev/breadboard-kits";

const board = new Board({
	title: "BourseCrafter",
});

const couseCrafter = board.addKit(CourseCrafterKit);

const input = board.input({ input: "input" });
const output = board.output({ output: "output" });
input.wire("*", output);

export default board;
export { board };
