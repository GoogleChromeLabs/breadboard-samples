#!/usr/bin/env tsx watch
import {
	ChromeStatusV1ApiFeature,
	getChromeStatusApiFeatureids,
	getChromeStatusApiFeatures,
	getChromeStatusV1Feature,
} from "./breadboard/chromeStatusApiFeatures";
import chromeStatusFeaturesV2, {
	ChromeStatusV2ApiFeature,
	getChromeStatusV2Feature,
	getChromeStatusV2FeatureIds,
} from "./breadboard/chromeStatusFeaturesV2";

export async function getUniqueChromeFeatureIds() {
	const v1 = await getChromeStatusApiFeatureids();
	const v2 = await getChromeStatusV2FeatureIds();
	const allFeatures = [...v1, ...v2];
	const uniqueIds: number[] = Array.from(new Set(allFeatures));
	return uniqueIds;
}

// get ids that occur in both v1 and v2
async function getCommonFeatureIds() {
	const ids = await getUniqueChromeFeatureIds();

	const v1 = await getChromeStatusApiFeatureids();
	const v2 = await getChromeStatusV2FeatureIds();
	// const commonFeatures = v1.filter((id) => v2.includes(id));

	const commonFeatures = ids.filter((id) => v1.includes(id) && v2.includes(id));
	return commonFeatures;
}

// find attributes that exist in both v1 and v2 and are different
async function findCommonAttributes() {
	const commonIds = await getCommonFeatureIds();
	const commonAttributes = [];
	for (const id of commonIds) {
		const v1 = await getChromeStatusV1Feature(id);
		const v2 = await getChromeStatusV2Feature(id);
		for (const key in v1) {
			if (v1[key] && v2[key]) {
				// deep compare
				if (JSON.stringify(v1[key]) === JSON.stringify(v2[key])) {
					continue;
				}
				const newValue = { key, v1: v1[key], v2: v2[key] };
				console.log(newValue);
				commonAttributes.push(newValue);
			}
		}
	}
	return commonAttributes;
}

type UnifiedChromeStatusFeature = ChromeStatusV1ApiFeature &
	ChromeStatusV2ApiFeature;

export async function getSeparatedFeatureData(id: number) {
	return {
		id,
		v1: await getChromeStatusV1Feature(id),
		v2: await getChromeStatusV2Feature(id),
	};
}

//  { resources: { samples: [], docs: [] }},
export async function filterFeaturesWithDocs<
	T extends { resources: { samples: string[]; docs: string[] } }
>(features: T[]): Promise<T[]> {
	return features.filter(
		(feature) =>
			feature.resources.samples.length > 0 || feature.resources.docs.length > 0
	);
}

export async function getFeaturesWithDocs() {
	// const features = await getCombinedFeatures();
	const v1Features = await filterFeaturesWithDocs(
		await getChromeStatusApiFeatures()
	);
	const v2Features = await filterFeaturesWithDocs(
		await chromeStatusFeaturesV2()
	);
	const uniqueIds = Array.from(
		new Set([...v1Features.map((f) => f.id), ...v2Features.map((f) => f.id)])
	);
	// const features = [...v1Features, ...v2Features];

	const features: UnifiedChromeStatusFeature[] = uniqueIds.map((id) => {
		const v1Feature = v1Features.find((f) => f.id === id);
		const v1Resources = v1Feature?.resources;
		const v2Feature = v2Features.find((f) => f.id === id);
		const v2Resources = v2Feature?.resources;
		// deduplicated list of resources
		const resources = {
			samples: Array.from(
				new Set([
					...(v1Resources?.samples ?? []),
					...(v2Resources?.samples ?? []),
				])
			),
			docs: Array.from(
				new Set([...(v1Resources?.docs ?? []), ...(v2Resources?.docs ?? [])])
			),
		};
		return {
			id,
			...v1Feature,
			...v2Feature,
			resources,
		};
	});

	return features;
}

(async () => {
	console.log("starting");

	console.log(
		"getFeaturesWithDocs",
		JSON.stringify(await getFeaturesWithDocs(), null, 2)
	);

	console.log("done");
})();
