import { BrowserInfo } from "./chromeStatusApiFeatures";
import fetchJson from "./fetchJson";

export type ChromeStatusV2ApiFeature = {
	blink_components: string[];
	breaking_change: boolean;
	browsers: {
		chrome: BrowserInfo;
		ff: Partial<BrowserView>;
		other: Partial<BrowserView>;
		safari: Partial<BrowserView>;
		webdev: Partial<BrowserView>;
	};
	created: RecordInfo;
	first_of_section: boolean;
	id: number;
	is_released: boolean;
	milestone: null | string; // Assuming the type for milestone can be string or null
	name: string;
	resources: {
		docs: string[];
		samples: string[];
	};
	standards: {
		maturity: Maturity;
		spec: string;
	};
	summary: string;
	unlisted: boolean;
	updated: RecordInfo;
};

export type ChromeBrowser = {
	blink_components: string[];
	bug: string;
	devrel: string[];
	flag: boolean;
	intervention: boolean;
	origintrial: boolean;
	owners: string[];
	prefixed: boolean;
	status: Status;
};

export type BrowserView = {
	view: {
		notes: string;
		text: string;
		url: string | null;
		val: number;
	};
};

type RecordInfo = {
	by: string;
	when: string; // Use Date if dates are always in a consistent format
};

type Maturity = {
	short_text: string;
	text: string;
	val: number;
};

type Status = {
	text: string;
	val: number;
};

export async function chromeStatusFeaturesV2(): Promise<
	ChromeStatusV2ApiFeature[]
> {
	return (await fetchJson(
		"https://chromestatus.com/features_v2.json"
	)) as Promise<ChromeStatusV2ApiFeature[]>;
}

export default chromeStatusFeaturesV2;

export async function getChromeStatusV2FeatureIds(): Promise<number[]> {
	const features = await chromeStatusFeaturesV2();
	return features.map((feature) => feature.id);
}

export async function getChromeStatusV2Feature(
	id: number
): Promise<ChromeStatusV2ApiFeature | undefined> {
	const features = await chromeStatusFeaturesV2();
	return features.find((feature) => feature.id === id);
}
