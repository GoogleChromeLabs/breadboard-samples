import { IDBPDatabase, openDB } from "idb";

const DB_NAME = "worker_db";
const STORE_NAME = "worker_store";

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
export async function storeData(
	key: string,
	data: unknown,
	store?: string,
	dbName?: string
) {
	const db: IDBPDatabase = await dbPromise(dbName, store);
	await db.put(STORE_NAME, data, key);
}

// Function to load data from IndexedDB
export async function loadData(key: any, store?: string, dbName?: string) {
	const db = await dbPromise(dbName, store);
	return await db.get(STORE_NAME, key);
}
