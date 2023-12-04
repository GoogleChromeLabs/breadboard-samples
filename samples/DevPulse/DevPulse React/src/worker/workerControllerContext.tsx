import React from "react";
import { WorkerControllerHook } from "~/worker/useWorkerController.ts";

export const WorkerControllerContext = React.createContext<{
	broadcastChannel: WorkerControllerHook;
	unregisterController: () => void;
} | null>(null);
