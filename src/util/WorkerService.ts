import Worker from "~/sw/worker.ts?worker";

class WorkerManager {
	private static instance: Worker = new Worker();

	public static getInstance(): Worker {
		if (!WorkerManager.instance) {
			WorkerManager.instance = new Worker();
		}
		return WorkerManager.instance;
	}
}

export default WorkerManager;
