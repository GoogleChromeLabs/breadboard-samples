import { useContext } from "react";
import { BroadcastChannelContext } from "./context";

export const useBroadCastChannelContext = () => {
	const context = useContext(BroadcastChannelContext);
	if (context === null) {
		throw new Error(
			"useBrandContext must be used within a BrandContextProvider"
		);
	}
	return context;
};
