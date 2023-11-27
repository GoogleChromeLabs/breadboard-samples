import { useContext } from "react";
import { BroadcastChannelContext } from "~/broadcastChannel/broadcastChannelContext.tsx";

export const useBroadcastChannelContext = () => {
	const context = useContext(BroadcastChannelContext);
	if (context === null) {
		throw new Error(
			"useBrandContext must be used within a BrandContextProvider"
		);
	}
	return context;
};
