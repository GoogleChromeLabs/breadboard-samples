import React, { ReactNode } from "react";
import useWorkerController from "~/worker/useWorkerController.ts";
import { WorkerControllerContext } from "~/worker/workerControllerContext.tsx";

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
