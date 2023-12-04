import React from "react";
import ReactDOM from "react-dom/client";
import { WorkerControllerProvider } from "worker/workerControllerProvider.tsx";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "~/core/redux/store.ts";

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
		<Provider store={store}>
			<WorkerControllerProvider
				broadcastChannel={new BroadcastChannel(BROADCAST_CHANNEL)}
			>

				<App />

			</WorkerControllerProvider>
		</Provider>
	</React.StrictMode>
);
