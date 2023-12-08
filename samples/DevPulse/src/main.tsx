import React from "react";
import ReactDOM from "react-dom/client";
import { WorkerControllerProvider } from "worker/workerControllerProvider.tsx";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "~/core/redux/store.ts";
import { PersistGate } from 'redux-persist/integration/react';


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<WorkerControllerProvider
					broadcastChannel={new BroadcastChannel(BROADCAST_CHANNEL)}
				>

					<App />

				</WorkerControllerProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
