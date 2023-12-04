import fetchJson from "./fetchJson";

type Feature = {
	blink_components: string[];
	breaking_change: boolean;
	browsers: {
		chrome: ChromeBrowser;
		ff: BrowserView;
		other: Partial<BrowserView>;
		safari: BrowserView;
		webdev: BrowserView;
	};
	created: RecordInfo;
	first_of_section: boolean;
	id: number;
	is_released: boolean;
	milestone: null | string; // Assuming the type for milestone can be string or null
	name: string;
	resources: {
		docs: any[]; // Replace 'any' with a more specific type if available
		samples: any[]; // Replace 'any' with a more specific type if available
	};
	standards: {
		maturity: Maturity;
		spec: string;
	};
	summary: string;
	unlisted: boolean;
	updated: RecordInfo;
};

type ChromeBrowser = {
	blink_components: string[];
	bug: string;
	devrel: any[]; // Replace 'any' with a more specific type if available
	flag: boolean;
	intervention: boolean;
	origintrial: boolean;
	owners: string[];
	prefixed: boolean;
	status: Status;
};

type BrowserView = {
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

export async function chromeStatusFeaturesV2(): Promise<Feature[]> {
	return await fetchJson("https://chromestatus.com/features_v2.json") as Promise<Feature[]>;
}

export default chromeStatusFeaturesV2;
