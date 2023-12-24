import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const memoryCache: Record<string, { data: unknown; timestamp: number }> = {};

export function makeCacheDirectory(cacheFilePath: string) {
	const cacheDirectory = path.dirname(cacheFilePath);
	if (!fs.existsSync(cacheDirectory)) {
		fs.mkdirSync(cacheDirectory, { recursive: true });
	}
}

export function writeCacheNode(url: string, data: unknown) {
	const cacheFilePath = getCacheFilePath(url);
	makeCacheDirectory(cacheFilePath);
	fs.writeFileSync(cacheFilePath, JSON.stringify(data));
}

export const isNode =
	typeof process !== "undefined" &&
	process.versions != null &&
	process.versions.node != null;

export function isEnvNode() {
	return isNode;
}

export function writeCache(url: string, data: unknown) {
	memoryCache[url] = { data, timestamp: new Date().getTime() };

	if (isNode) {
		writeCacheNode(url, data);
	} else {
		writeCacheWeb(url, data);
	}
}

export function readCache(url: string, maxAge: Date = DEFAULT_MAX_AGE) {
	// First, check in-memory cache
	const cachedItem = memoryCache[url];
	if (cachedItem) {
		const now = new Date().getTime();
		if (now - cachedItem.timestamp <= maxAge.getTime()) {
			return cachedItem.data;
		}
		// If in-memory cache is stale, remove the entry
		delete memoryCache[url];
	}

	// Then, check file-based cache
	if (isNode) {
		return readCacheNode(url, maxAge);
	} else {
		return readCacheWeb(url, maxAge);
	}
}

const now = new Date();
const DEFAULT_MAX_AGE: Date = new Date(now.setDate(now.getDate() - 1));

// Modifications needed for web environment caching
export function readCacheWeb(url: string, maxAge: Date = DEFAULT_MAX_AGE) {
	const data = localStorage.getItem(url);
	if (data) {
		const cachedData = JSON.parse(data);
		const now = new Date();

		// Check if the cached data includes a timestamp and if it's expired
		if (
			cachedData.timestamp &&
			now.getTime() - cachedData.timestamp > maxAge.getTime()
		) {
			return null;
		}

		return cachedData.data;
	}
	return null;
}

export function writeCacheWeb(url: string, data: unknown) {
	const cacheData = {
		data: data,
		timestamp: new Date().getTime(), // Add a timestamp
	};
	localStorage.setItem(url, JSON.stringify(cacheData));
}

export function getCacheFilePath(url: string) {
	let encodedUri = encodeURIComponent(url);
	if (!encodedUri.endsWith(".json")) {
		encodedUri += ".json";
	}
	return path.join(__dirname, ".cache", encodedUri);
}

export function readCacheNode(url: string, maxAge: Date = DEFAULT_MAX_AGE) {
	const cacheFilePath = getCacheFilePath(url);
	if (fs.existsSync(cacheFilePath)) {
		const stats = fs.statSync(cacheFilePath);
		const now = new Date();
		if (
			maxAge !== undefined &&
			now.getTime() - stats.mtime.getTime() > maxAge.getTime()
		) {
			return null;
		}

		return JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
	}
	return null;
}

export default readCache;
