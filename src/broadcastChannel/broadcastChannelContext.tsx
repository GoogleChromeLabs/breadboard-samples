import React from "react";
import { BroadcastChannelHook } from "~/broadcastChannel/useBroadcastChannel.ts";

export const BroadcastChannelContext = React.createContext<{
	broadcastChannel: BroadcastChannelHook;
} | null>(null);
