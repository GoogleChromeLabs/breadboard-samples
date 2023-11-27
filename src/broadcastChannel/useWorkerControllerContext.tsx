import { useContext } from "react";
import { WorkerControllerContext } from "~/broadcastChannel/workerControllerContext.tsx";

export const useWorkerControllerContext = () => {
	const context = useContext(WorkerControllerContext);
	if (context === null) {
		throw new Error(
			"useBrandContext must be used within a BrandContextProvider"
		);
	}
	return context;
};
