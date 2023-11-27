import React, { ReactNode } from "react";
import useBroadcastChannel from "~/broadcastChannel/useBroadcastChannel.ts";
import { BroadcastChannelContext } from "./broadcastChannelContext";

export function BroadcastChannelProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: BroadcastChannel;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useBroadcastChannel(broadcastChannel);
	return (
		<BroadcastChannelContext.Provider value={{ broadcastChannel: bc }}>
			{children}
		</BroadcastChannelContext.Provider>
	);
}
