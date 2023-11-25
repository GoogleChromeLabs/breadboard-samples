import React, { useEffect, useState } from "react";
import { BROADCAST_CHANNEL } from "~/constants.ts";

const broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);

interface WorkerMessage {
	output: {
		[key: string]: unknown;
	}[];
	attribute?: string;
	iteration?: number;
	currentDateTime?: string;
	type?: string;
	node?: string;
	message?: string;
}

function sendMessage(data: unknown) {
	broadcastChannel.postMessage(data);
}

export const WorkerComponent: React.FC = () => {
	const [outputData, setOutputData] = useState<any[]>([]); // State for storing output data
	// const [dateTime, setDateTime] = useState("");
	// const [iteration, setIteration] = useState(0);
	const [inputData, setInputData] = useState<{
		node: string;
		attribute: string;
		message: string
	} | null>(null);

	function handleMessage(data: WorkerMessage) {
		console.debug("main", data);
		// if (data.iteration) setIteration(data.iteration);
		// if (data.currentDateTime) setDateTime(data.currentDateTime);
		if (data.type === 'inputNeeded') setInputData({
			node: data.node!,
			attribute: data.attribute!,
			message: data.message!
		});
		if (data.output) {
			setOutputData(prevData => [...prevData, {
				node: data.node,
				output: data.output
			}]); // Update the output data state
		}
	}

	useEffect(() => {
		const handleBroadcastMessage = (event: MessageEvent) => {
			handleMessage(event.data);
		};

		broadcastChannel.addEventListener('message', handleBroadcastMessage);
		return () => broadcastChannel.removeEventListener('message', handleBroadcastMessage);
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, node: string, attribute: string) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector('input');
		sendMessage({
			command: 'inputResponse',
			node,
			attribute,
			value: input?.value
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
					<form onSubmit={(e) => handleSubmit(e, inputData?.node, inputData?.attribute)}>
						<label htmlFor="">{inputData.message}</label>
						<br/>
						<input type="text" placeholder={`${inputData.node}.${inputData.attribute}`}/>
						<button type="submit">Submit</button>
					</form>
				)}
			</div>
			<div
				style={{
					backgroundColor: '#282c34', // Dark background
					color: '#abb2bf', // Light text color
					fontFamily: 'Consolas, "Courier New", monospace', // Monospaced font
					padding: '20px',
					borderRadius: '5px',
					boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
					overflow: 'auto',
					textAlign: 'left',
				}}
			>
				{outputData.map((data, index) => (
					<pre
						key={index}
						style={{
							whiteSpace: 'pre-wrap',
							margin: '0',
						}}
					>
						{JSON.stringify(data, null, 2)}
					</pre>
				))}
			</div>
		</div>
	);
};

export default WorkerComponent;
