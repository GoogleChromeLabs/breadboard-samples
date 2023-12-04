import { useEffect, useMemo, useState } from "react";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import { WorkerData, WorkerStatus } from "sw/types.ts";

export type WorkerControllerHook = {
	input: WorkerData | null;
	output: unknown[];
	start: () => void;
	pause: () => void;
	stop: () => void;
	send: (data: WorkerData, clearInput?: boolean) => void;
	status: WorkerStatus;
};

const useWorkerController = (
	bcChannel?: BroadcastChannel
): WorkerControllerHook => {
	const broadcastChannel = useMemo(() => {
		if (bcChannel) {
			return bcChannel;
		}
		return new BroadcastChannel(BROADCAST_CHANNEL);
	}, [bcChannel]);
	const [input, setInput] = useState<WorkerData | null>(null);
	const [output, setOutput] = useState<unknown[]>([]);
	const [status, setStatus] = useState<WorkerStatus>("idle");
	//const appDispatch = useAppDispatch();

	//console.log(appDispatch.dispatch(getStories()));

	const handleMessage = (event: MessageEvent) => {
		if (event.data.type === "inputNeeded")
			setInput({
				node: event.data.node!,
				attribute: event.data.attribute!,
				message: event.data.message!,
			});
		if (event.data.output) {
			setOutput((prevData) => [
				...prevData,
				{
					node: event.data.node,
					output: event.data.output,
				},
			]); // Update the output data state
		}
		if (event.data.type === "status") {
			setStatus(event.data.status);
		}
	};

	useEffect(() => {
		if (!broadcastChannel) return;
		broadcastChannel.removeEventListener("message", handleMessage);
		broadcastChannel.addEventListener("message", handleMessage);
		return () =>
			broadcastChannel.removeEventListener("message", handleMessage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [broadcastChannel]);

	const start = () => {
		broadcastChannel.postMessage({
			command: "start",
		});
		setStatus(WorkerStatus.loading);
	};

	const pause = () => {
		broadcastChannel.postMessage({
			command: "pause",
		});
		setStatus(WorkerStatus.loading);
	};

	const stop = () => {
		broadcastChannel.postMessage({
			command: "stop",
		});
		setStatus(WorkerStatus.loading);
	};

	const send = (data: WorkerData, clearInput: boolean = true) => {
		broadcastChannel.postMessage({
			command: "inputResponse",
			...data,
		});
		if (clearInput) {
			setInput(null);
		}
	};

	return {
		input,
		output,
		start,
		pause,
		stop,
		send,
		status,
	};
};

export default useWorkerController;
