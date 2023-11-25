import React, { useEffect, useState } from "react";
import { BROADCAST_CHANNEL } from "~/constants.ts";

const broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);

interface WorkerMessage {
	iteration?: number;
	currentDateTime?: string;
	type?: string;
	nodeID?: string;
	message?: string;
}

function sendMessage(data: unknown) {
	broadcastChannel.postMessage(data);
}

export const WorkerComponent: React.FC = () => {
	const [dateTime, setDateTime] = useState("");
	const [iteration, setIteration] = useState(0);
	const [inputData, setInputData] = useState<{ nodeID: string; message: string } | null>(null);

	function handleMessage(data: WorkerMessage) {
		console.debug("main", data);
		if (data.iteration) setIteration(data.iteration);
		if (data.currentDateTime) setDateTime(data.currentDateTime);
		if (data.type === 'inputNeeded') setInputData({nodeID: data.nodeID!, message: data.message!});
	}

	useEffect(() => {
		const handleBroadcastMessage = (event: MessageEvent) => {
			handleMessage(event.data);
		};

		broadcastChannel.addEventListener('message', handleBroadcastMessage);
		return () => broadcastChannel.removeEventListener('message', handleBroadcastMessage);
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, nodeID: string) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector('input');
		sendMessage({
			command: 'inputResponse',
			nodeID: nodeID,
			userInput: input?.value
		});
		setInputData(null);
	};

	function startLoop() {
		sendMessage({
			command: "start",
		});
	}

	function pauseLoop() {
		sendMessage({
			command: "pause",
		});
	}

	function stopLoop() {
		sendMessage({
			command: "stop",
		});
	}
	return (

		<div style={{padding: "20px", fontFamily: "Arial, sans-serif"}}>
			<div>
				<button
					style={{
						marginRight: "10px",
						padding: "10px 20px",
						cursor: "pointer",
					}}
					onClick={startLoop}
				>
					Start
				</button>
				<button
					style={{
						marginRight: "10px",
						padding: "10px 20px",
						cursor: "pointer",
					}}
					onClick={pauseLoop}
				>
					Pause
				</button>
				<button
					style={{ padding: "10px 20px", cursor: "pointer" }}
					onClick={stopLoop}
				>
					Stop
				</button>
			</div>
			<div style={{padding: "20px", fontFamily: "Arial, sans-serif"}}>
				{inputData && (
					<form onSubmit={(e) => handleSubmit(e, inputData.nodeID)}>
						<input type="text" placeholder={`Input for ${inputData.nodeID}`}/>
						<button type="submit">Submit</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default WorkerComponent;
