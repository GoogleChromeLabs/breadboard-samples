import React from "react";
import { BroadcastChannelHook } from "~/broadcastChannel/useBroadcastChannel.ts";

export const WorkerControllerContext = React.createContext<{
	broadcastChannel: BroadcastChannelHook;
} | null>(null);
