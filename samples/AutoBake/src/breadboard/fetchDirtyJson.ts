import { readCache, writeCache } from "~/breadboard/crossEnvCache.ts";

export async function fetchDirtyJson(
	url: string,
	excessString: string
): Promise<unknown> {
	let jsonData = readCache(url);

	if (jsonData) {
		return jsonData;
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	let data = await response.text();
	if (data.startsWith(excessString)) {
		data = data.substring(excessString.length);
	}

	jsonData = JSON.parse(data);
	writeCache(url, jsonData);

	return jsonData;
}

export default fetchDirtyJson;
