import React, { ReactNode } from "react";
import useWorkerController from "~/worker/useWorkerController.ts";
import { WorkerControllerContext } from "~/worker/workerControllerContext.tsx";

export function WorkerControllerProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: BroadcastChannel;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useWorkerController(broadcastChannel);
	const unregisterController = () => {
		const workerName =
			import.meta.env.MODE === "production"
				? "/sw/worker.js"
				: "/dev-sw.js?dev-sw";
		navigator.serviceWorker
			.getRegistrations()
			.then(function (registrations) {
				for (const registration of registrations) {
					if (registration.active?.scriptURL.includes(workerName)) {
						console.log("unregistering service worker", registration);
						registration.unregister();
					}
				}
			});
	};
	return (
		<WorkerControllerContext.Provider
			value={{ broadcastChannel: bc, unregisterController }}
		>
			{children}
		</WorkerControllerContext.Provider>
	);
}
