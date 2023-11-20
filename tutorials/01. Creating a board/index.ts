#!/usr/bin/env npx -y tsx

import { Board } from "@google-labs/breadboard";

const board = new Board({
	title: "My First Board",
	description: "This is my first board",
});

const input = board.input();

const output = board.output();

input.wire("message->", output);

board.runOnce({
	message: "Hello World",
}).then((result) => {
	console.log("result", result);
});

console.log(board);
