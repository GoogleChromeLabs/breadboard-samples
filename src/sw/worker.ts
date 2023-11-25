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

import { BROADCAST_CHANNEL } from "~/constants.ts";
import { loadData, storeData } from "~/services/databaseService.ts";
import { loadCounter, updateCounter } from "~/services/counterService.ts";

let iteration: number = 0;
let loopActive: boolean = false;
let loopPaused: boolean = false;

const broadcastChannel: BroadcastChannel = new BroadcastChannel(
	BROADCAST_CHANNEL
);

// Main loop for counter
async function asyncLoop() {
	await loadCounter();
	while (loopActive) {
		if (!loopPaused) {
			iteration++;
			await updateCounter(iteration);
			console.debug("serviceWorker", "Loop", iteration);
			broadcastChannel.postMessage({
				iteration,
				currentDateTime: new Date().toISOString(),
			});
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	iteration = 0;
	await updateCounter(iteration);
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
				updateCounter(iteration).then();
				asyncLoop().then(() => console.debug("asyncLoop finished"));
			} else {
				console.debug("Loop already active");
			}
			loopActive = true;
			loopPaused = false;
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
