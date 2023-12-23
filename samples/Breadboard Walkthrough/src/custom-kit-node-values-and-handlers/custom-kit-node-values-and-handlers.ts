#!/usr/bin/env npx -y tsx

import { KitBuilder } from "@google-labs/breadboard/kits";

// The NodeValue denotes the value types which can be received and returned by a node
export type NodeValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| NodeValue[]
	| { [key: string]: NodeValue };

export type InputValues = Record<string, NodeValue>;
export type OutputValues = Partial<Record<string, NodeValue>>; // This is similiar to the InputValues except all values are optional

const echo = async (inputs) => inputs; // This simple handler will return the given inputs

// This will combine two strings together
const concat = async (inputs: InputValues) => {
	const { a, b } = inputs;

	if (typeof a !== "string" || typeof b !== "string") {
		throw new Error("Both values must be strings.");
	}

	return { value: a.concat(b) };
};

const builder = new KitBuilder({
	title: "My Custom Kit",
	description: "The description of my custom kit",
	url: "npm:my-custom-kit", // Additional setup is required to create as an npm package
	version: "0.0.1",
});

export const MyCustomKit = builder.build({
	echo,
	concat,
	split: async (inputs: InputValues): Promise<OutputValues> => {
		// This splits strings using comma separators
		const input = inputs.input;

		if (typeof input !== "string") {
			throw new Error("Must provide a string to split.");
		}

		const values = input.split(",");

		return { value: values };
	},
});

export type myCustomKit = InstanceType<typeof MyCustomKit>;
export default MyCustomKit;
