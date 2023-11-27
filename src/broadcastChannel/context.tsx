import React, { ReactNode } from "react";
import useBroadCastChannel, {
	BroadcastChannelHook,
} from "~/broadcastChannel/useBroadcastChannel";

export const BroadcastChannelContext = React.createContext<{
	broadcastChannel: BroadcastChannelHook;
} | null>(null);

export function BroadcastChannelProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: BroadcastChannel;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useBroadCastChannel(broadcastChannel);
	return (
		<BroadcastChannelContext.Provider value={{ broadcastChannel: bc }}>
			{children}
		</BroadcastChannelContext.Provider>
	);
}
