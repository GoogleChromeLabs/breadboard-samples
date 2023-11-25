/// <reference lib="webworker" />

// declare const self: DedicatedWorkerGlobalScope;
declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
	console.debug("install", event);
	event.waitUntil(self.skipWaiting()); // Forces the waiting service worker to become the active service worker
});

self.addEventListener("activate", (event) => {
	console.debug("activate", event);
	console.debug("clients", self.clients);
	event.waitUntil(self.clients.claim()); // Immediately control any open clients
});

import { IDBPDatabase, openDB } from "idb";
import { BROADCAST_CHANNEL } from "~/constants.ts";

const DB_NAME = "worker_db";
const STORE_NAME = "dataStore";
const COUNTER_KEY = "currentCounter";

let iteration: number = 0;
let loopActive: boolean = true;
let loopPaused: boolean = false;

const broadcastChannel: BroadcastChannel = new BroadcastChannel(
	BROADCAST_CHANNEL
);

async function dbPromise(
	dbName: string = DB_NAME,
	storeName: string = STORE_NAME,
	version: number = 1
) {
	return await openDB(dbName, version, {
		upgrade(db) {
			db.createObjectStore(storeName);
		},
	});
}

// Function to store data in IndexedDB
async function storeData(
	key: string,
	data: unknown,
	store?: string,
	dbName?: string
) {
	const db: IDBPDatabase = await dbPromise(dbName, store);
	await db.put(STORE_NAME, data, key);
}

// Function to load data from IndexedDB
async function loadData(key: any, store?: string, dbName?: string) {
	const db = await dbPromise(dbName, store);
	return await db.get(STORE_NAME, key);
}

// Update counter in IndexedDB
async function updateCounterInDB() {
	await storeData(COUNTER_KEY, iteration);
}

// Load counter from IndexedDB
async function loadCounterFromDB() {
	const savedCounter = await loadData(COUNTER_KEY);
	iteration = savedCounter || 0;
}

// Main loop for counter
async function asyncLoop() {
	await loadCounterFromDB();
	while (loopActive) {
		if (!loopPaused) {
			iteration++;
			await updateCounterInDB();
			console.debug("serviceWorker", "Loop", iteration);
			broadcastChannel.postMessage({
				iteration,
				currentDateTime: new Date().toISOString(),
			});
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	iteration = 0;
	await updateCounterInDB();
}

// Message handling for Broadcast Channel and direct messages
function handleCommand(data: {
	command: string;
	key: string | undefined;
	data: unknown;
	store: string | undefined;
	dbName: string | undefined;
}) {
	console.debug("serviceWorker", "handleCommand", data);
	switch (data.command) {
		case "start":
			if (!loopActive) {
				// iteration = 0;
				updateCounterInDB().then();
			}
			loopActive = true;
			loopPaused = false;
			asyncLoop().then(() => console.debug("asyncLoop finished"));
			break;
		case "pause":
			loopPaused = true;
			break;
		case "stop":
			loopActive = false;
			loopPaused = false;
			break;
		case "store":
			storeData(data.key!, data.data, data.store, data.dbName).then((r) =>
				console.debug("storeData finished", r)
			);
			break;
		case "load":
			loadData(data.key).then((loadedData) => {
				broadcastChannel.postMessage({
					type: "loadedData",
					key: data.key,
					data: loadedData,
				});
			});
			break;
	}
}

broadcastChannel.onmessage = (event) => {
	console.debug("serviceWorker", "broadcastChannel.onmessage", event);
	handleCommand(event.data);
};

self.addEventListener("message", (event) => {
	console.debug("serviceWorker", "self.addEventListener('message')", event);
	handleCommand(event.data);
});
