import { readCache, writeCache } from "~/breadboard/crossEnvCache.ts";

export async function fetchJson(url: string): Promise<unknown> {
	let jsonData = readCache(url);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	jsonData = await response.json();
	writeCache(url, jsonData);

	return jsonData;
}

export default fetchJson;
