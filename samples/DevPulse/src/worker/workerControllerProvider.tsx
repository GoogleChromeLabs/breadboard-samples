import React, { ReactNode, useEffect } from "react";
import useWorkerController from "~/worker/useWorkerController.ts";
import { WorkerControllerContext } from "~/worker/workerControllerContext.tsx";
import { registerServiceWorkerIfNeeded } from "~/sw/workerRegistration";

export function WorkerControllerProvider({
	broadcastChannel,
	children,
}: {
	broadcastChannel?: BroadcastChannel;
	children: ReactNode;
}): React.JSX.Element {
	const bc = useWorkerController(broadcastChannel);
	useEffect(() => {
		registerServiceWorkerIfNeeded();
	}, []);
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
						console.log(
							"unregistering service worker",
							registration
						);
						registration.unregister();
					}
				}
			});
	};
	return (
		<WorkerControllerContext.Provider
			value={{ broadcastChannel: bc, unregisterController, workerSteps: bc.workerSteps }}
		>
			{children}
		</WorkerControllerContext.Provider>
	);
}
