import { useEffect, useMemo, useState } from "react";
import { BROADCAST_CHANNEL } from "~/constants.ts";
import { WorkerData, WorkerStatus } from "sw/types.ts";
import { useDispatch, useSelector } from "react-redux";
import { outputSuccess, selectOutput } from "~/hnStory/outputSlice";
import { StoryOutput } from "~/hnStory/domain";
import { InputSteps, addInputCollection} from "~/hnStory/inputSlice";
import { RootState } from "~/core/redux/store";

export type WorkerControllerHook = {
	input: WorkerData | null;
	output: StoryOutput[];
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
	const output = useSelector((state: RootState) => selectOutput(state));
	const [status, setStatus] = useState<WorkerStatus>("idle");
	const dispatch = useDispatch();
	let inputSteps: InputSteps = {};
	let step = 0;
	const handleMessage = async (event: MessageEvent) => {
		if (event.data.type === "inputNeeded") {
			const inputObject = {
				node: event.data.node!,
				attribute: event.data.attribute!,
				message: event.data.message!,
			}
			inputSteps[step++] = inputObject;
			setInput(inputObject);
		}
		if (event.data.output) {
			dispatch(addInputCollection(inputSteps));
			inputSteps = {};
			dispatch(outputSuccess(event.data.output));
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
		setStatus(WorkerStatus.running);
	};

	const pause = () => {
		broadcastChannel.postMessage({
			command: "pause",
		});
		setStatus(WorkerStatus.paused);
	};

	const stop = () => {
		broadcastChannel.postMessage({
			command: "stop",
		});
		setStatus(WorkerStatus.stopped);
	};

	const send = (data: WorkerData) => {
		broadcastChannel.postMessage({
			command: "inputResponse",
			...data,
		});
		
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
