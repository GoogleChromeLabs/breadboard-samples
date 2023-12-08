// Update counter in IndexedDB
import { loadData, storeData } from "~/services/databaseService.ts";

const COUNTER_KEY = "currentCounter";

export async function updateCounter(data: number) {
	await storeData(COUNTER_KEY, data);
}

// Load counter from IndexedDB
export async function loadCounter() {
	try {
		return await loadData(COUNTER_KEY);
	} catch (e) {
		console.error(e);
		return 0;
	}
}
