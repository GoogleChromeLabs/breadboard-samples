import React from "react";
import { WorkerControllerHook } from "~/broadcastChannel/useWorkerController.ts";

export const WorkerControllerContext = React.createContext<{
	broadcastChannel: WorkerControllerHook;
} | null>(null);
