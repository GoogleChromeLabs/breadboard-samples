import { useEffect, useMemo, useState } from "react";
import { BROADCAST_CHANNEL } from "~/constants";
import { WorkerData, WorkerMessage, WorkerStatus } from "./types";

const useBroadCastChannel = () => {
	const broadcastChannel = useMemo(
		() => new BroadcastChannel(BROADCAST_CHANNEL),
		[]
	);
	const [input, setInput] = useState<WorkerData | null>(null);
	const [output, setOutput] = useState<unknown[]>([]);
	const [status, setStatus] = useState<WorkerStatus>("idle");

	const handleMessage = (data: WorkerMessage) => {
		if (data.type === "inputNeeded")
			setInput({
				node: data.node!,
				attribute: data.attribute!,
				message: data.message!,
			});
		if (data.output) {
			setOutput((prevData) => [
				...prevData,
				{
					node: data.node,
					output: data.output,
				},
			]); // Update the output data state
		}
	};

	useEffect(() => {
		const handleBroadcastMessage = (event: MessageEvent) => {
			handleMessage(event.data);
		};

		broadcastChannel.addEventListener("message", handleBroadcastMessage);
		return () =>
			broadcastChannel.removeEventListener(
				"message",
				handleBroadcastMessage
			);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const start = () => {
		broadcastChannel.postMessage({
			command: "start",
		});
		setStatus(WorkerStatus.running)
	}

	const pause = () => {
		broadcastChannel.postMessage({
			command: "pause",
		});
		setStatus(WorkerStatus.paused);
	}

	const stop = () => {
		broadcastChannel.postMessage({
			command: "stop",
		});
		setStatus(WorkerStatus.stopped);
	}

	const send = (data: WorkerData, clearInput: boolean = true) => {
		broadcastChannel.postMessage({
			command: "inputResponse",
			...data,
		});
		if (clearInput) {
			setInput(null);
		}
	};

	return { input, output, start, pause, stop, send, status };
};

export default useBroadCastChannel;
