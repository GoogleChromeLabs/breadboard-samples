import { FilterKit, ListKit, ObjectKit } from "@exadev/breadboard-kits";
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";
import {
	Board,
	InputValues,
	NodeValue,
	OutputValues,
} from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import chromeStatusApiFeatures from "./chromeStatusApiFeatures";
import { chromeStatusFeaturesV2 } from "./chromeStatusFeaturesV2";
import { chromeVersions } from "./chromeVersions";

const board = new Board({
	title: "AutoBake",
});

//////////////////////////////////////////////////
const chromeStatusKit = board.addKit(
	new KitBuilder({
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
	})
);

const arrayFilterKit = board.addKit(
	new KitBuilder({
		title: "ArrayFilterKit",
		url: "npm:@exadev/breadboard-kits/array-filter",
	}).build({
		async findAll(
			inputs: InputValues & {
				list: InputValues[];
				field: string;
				filter: InputValues;
			}
		): Promise<OutputValues> {
			const { list, field, filter } = inputs;
			if (!list || !field || !filter) {
				throw new Error("Missing required inputs");
			}

			const filteredList = list.filter((item) => {
				const value = item[field];
				return value == filter;
			});

			return { field, filter, list: filteredList };
		},
	})
);

const listKit = board.addKit(ListKit);
const filterKit = board.addKit(FilterKit);
const objectKit = board.addKit(ObjectKit);
//////////////////////////////////////////////////
const chromeVersionsNode = chromeStatusKit.versions();
// chromeVersionsNode.wire("*", board.output());
//////////////////////////////////////////////////
const chromeStatusApiFeaturesNode = chromeStatusKit.chromeStatusApiFeatures();
const popV1Features = listKit.pop();
chromeStatusApiFeaturesNode.wire("features->list", popV1Features);
const spreadChromeStatusV1 = objectKit.spread();
popV1Features.wire("item->object", spreadChromeStatusV1);
// popV1Features.wire("list", popV1Features);
// spreadChromeStatusV1.wire("*", board.output());
//////////////////////////////////////////////////
const chromeStatusFeaturesV2Node = chromeStatusKit.chromeStatusFeaturesV2();
const popV2Features = listKit.pop();
chromeStatusFeaturesV2Node.wire("features->list", popV2Features);
const spreadChromeStatusV2 = objectKit.spread();
popV2Features.wire("item->object", spreadChromeStatusV2);
popV2Features.wire("list", popV2Features);
// spreadChromeStatusV2.wire("*", board.output());
const filterMatchingIds = arrayFilterKit.findAll({
	field: "id",
});
chromeStatusApiFeaturesNode.wire("features->list.", filterMatchingIds);
// chromeStatusFeaturesV2Node.wire("features->list", filterMatchingIds);
spreadChromeStatusV2.wire("id->filter", filterMatchingIds);
filterMatchingIds.wire("*", board.output());

generateAndWriteCombinedMarkdown({
	board,
	title: "DevPulse",
	filename: "./README",
	dir: "./",
});

export default board;
