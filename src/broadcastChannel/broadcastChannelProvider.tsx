import React, { ReactNode } from "react";
import useBroadcastChannel from "~/broadcastChannel/useBroadcastChannel.ts";
import { WorkerControllerContext } from "broadcastChannel/workerControllerContext.tsx";

export function BroadcastChannelProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: BroadcastChannel;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useBroadcastChannel(broadcastChannel);
	return (
		<WorkerControllerContext.Provider value={{ broadcastChannel: bc }}>
			{children}
		</WorkerControllerContext.Provider>
	);
}
