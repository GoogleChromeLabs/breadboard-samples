const registerServiceWorker = async (
	scriptUrl: string,
	type: "classic" | "module",
	verbose: boolean = false
) => {
	if (!("serviceWorker" in navigator)) {
		if (verbose) {
			console.log("Service workers are not supported.");
		}
		return;
	}
	if ((await getCurrentActiveSWs(scriptUrl)).length > 0) {
		if (verbose) {
			console.log("Service worker already registered.");
		}
		return;
	}
	if (verbose) {
		console.log("Registering service worker...");
	}
	const registration = await navigator.serviceWorker
		.register(scriptUrl, {
			type: type,
		})
		.then((registration) => {
			if (verbose) {
				console.log("Service worker scope", registration.scope);
			}
		})
		.catch((err) => console.error(err));
	if (verbose) {
		console.log("SW registered: ", registration);
	}
};

const getCurrentActiveSWs = async (workerName: string) => {
	const registrations = await navigator.serviceWorker.getRegistrations();
	const registration = registrations.filter((registration) =>
		registration.active?.scriptURL.includes(workerName)
	);
	return registration;
};

export const registerServiceWorkerIfNeeded = () => {
	const scriptUrl =
		import.meta.env.MODE === "production"
			? "/sw/worker.js"
			: "/dev-sw.js?dev-sw";
	registerServiceWorker(
		scriptUrl,
		"module",
		import.meta.env.MODE !== "production"
	);
};
