import React from "react";
import useWorkerSteps from "~/hnStory/components/useWorkerSteps";
import { WorkerControllerHook } from "~/worker/useWorkerController.ts";

export const WorkerControllerContext = React.createContext<{
	broadcastChannel: WorkerControllerHook;
	unregisterController: () => void;
	workerSteps: ReturnType<typeof useWorkerSteps>;
} | null>(null);
