import React, { ReactNode } from "react";
import useWorkerController from "~/broadcastChannel/useWorkerController.ts";
import { WorkerControllerContext } from "broadcastChannel/workerControllerContext.tsx";

export function WorkerControllerProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: BroadcastChannel;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useWorkerController(broadcastChannel);
	return (
		<WorkerControllerContext.Provider value={{ broadcastChannel: bc }}>
			{children}
		</WorkerControllerContext.Provider>
	);
}
