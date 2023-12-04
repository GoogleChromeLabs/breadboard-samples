import { ListKit } from "@exadev/breadboard-kits";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import { Board, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import chromeStatusApiFeatures from "./chromeStatusApiFeatures";
import { chromeStatusFeaturesV2 } from "./chromeStatusFeaturesV2";
import { chromeVersions } from "./chromeVersions";

const chromeStatusKitBuilder = new KitBuilder({
	title: "Chrome Status",
	url: "npm:@exadev/breadboard-kits/chrome-status",
}).build({
	async versions(): Promise<OutputValues> {
		return chromeVersions();
	},
	async chromeStatusApiFeatures(): Promise<OutputValues> {
		return chromeStatusApiFeatures();
	},
	async chromeStatusFeaturesV2(): Promise<OutputValues> {
		return { features: await chromeStatusFeaturesV2() };
	},
});

const board = new Board({
	title: "AutoBake",
});

//////////////////////////////////////////////////
const chromeStatusKit = board.addKit(chromeStatusKitBuilder);
const listKit = board.addKit(ListKit);
//////////////////////////////////////////////////
const chromeVersionsNode = chromeStatusKit.versions();
chromeVersionsNode.wire("*", board.output());
//////////////////////////////////////////////////
const chromeStatusApiFeaturesNode = chromeStatusKit.chromeStatusApiFeatures();
const popV1Features = listKit.pop();
chromeStatusApiFeaturesNode.wire("features->list", popV1Features);
popV1Features.wire("item", board.output());
//////////////////////////////////////////////////
const chromeStatusFeaturesV2Node = chromeStatusKit.chromeStatusFeaturesV2();
const popV2Features = listKit.pop();
chromeStatusFeaturesV2Node.wire("features->list", popV2Features);
popV2Features.wire("item", board.output());

generateAndWriteCombinedMarkdown({
	board,
	title: "DevPulse",
	filename: "./README",
	dir: "./",
});

export default board;
