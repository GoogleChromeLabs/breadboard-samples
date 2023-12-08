import React from "react";
import ReactDOM from "react-dom/client";
import { WorkerControllerProvider } from "worker/workerControllerProvider.tsx";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "~/core/redux/store.ts";
import { PersistGate } from 'redux-persist/integration/react';
import { broadcastChannel } from "./sw/worker.ts";


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<WorkerControllerProvider broadcastChannel={broadcastChannel}>
					<App />
				</WorkerControllerProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
