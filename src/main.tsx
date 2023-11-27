import React from "react";
import ReactDOM from "react-dom/client";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import { BroadcastChannelProvider } from "~/broadcastChannel/context.tsx";
import App from "./App.tsx";
import "./index.css";

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register(
		import.meta.env.MODE === "production"
			? "/sw/worker.js"
			: "/dev-sw.js?dev-sw",
		{ type: import.meta.env.MODE === "production" ? "classic" : "module" }
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BroadcastChannelProvider
			broadcastChannel={new BroadcastChannel(BROADCAST_CHANNEL)}
		>
			<App />
		</BroadcastChannelProvider>
	</React.StrictMode>
);
