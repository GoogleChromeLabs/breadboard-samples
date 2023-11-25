import React, { useEffect, useState } from "react";
import { BROADCAST_CHANNEL } from "~/constants.ts";

const broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);

function sendMessage(data: unknown) {
	broadcastChannel.postMessage(data);
}

function renderInputForm(nodeID: string, message: string) {
	// Create form elements
	const form = document.createElement('form');
	const input = document.createElement('input');
	const submitButton = document.createElement('button');

	// Configure elements
	input.type = 'text';
	input.placeholder = `Input for ${nodeID}`;
	submitButton.type = 'submit';
	submitButton.textContent = 'Submit';

	// Append elements to the form
	form.appendChild(input);
	form.appendChild(submitButton);

	// Append form to the body or a specific div
	document.body.appendChild(form);

	// Handle form submission
	form.onsubmit = (e) => {
		e.preventDefault();
		broadcastChannel.postMessage({
			command: 'inputResponse',
			nodeID: nodeID,
			userInput: input.value
		});
		form.remove(); // Remove the form after submission
	};
}

export const WorkerComponent: React.FC = () => {
	const [dateTime, setDateTime] = useState("");
	const [iteration, setIteration] = useState(0);

	function handleMessage(data: any) {
		console.debug("main", data);
		if (data.iteration) {
			setIteration(data.iteration!);
		}
		if (data.currentDateTime) {
			setDateTime(data.currentDateTime!);
		}
		if (data.type === 'inputNeeded') {
			const {nodeID, message} = data;
			renderInputForm(nodeID, message);
		}
	}

	// broadcastChannel.onmessage = event => {
	// 	if (event.data.type === 'inputNeeded') {
	// 		const {nodeID, message} = event.data;
	// 		renderInputForm(nodeID, message);
	// 	}
	// };

	useEffect(() => {
		broadcastChannel.onmessage = (event) => handleMessage(event.data);
		self.addEventListener("message", (event) => handleMessage(event.data));
	}, []);

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
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1 style={{ textAlign: "center" }}>Worker Data</h1>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: "20px",
				}}
			>
				<div style={{ marginRight: "20px" }}>
					<div>
						<strong>Iteration:</strong>
					</div>
					<div style={{ fontSize: "1.2em", marginTop: "5px" }}>
						{iteration}
					</div>
				</div>

				<div>
					<div>
						<strong>Current Date Time:</strong>
					</div>
					<div style={{ fontSize: "1.2em", marginTop: "5px" }}>
						{dateTime}
					</div>
				</div>
			</div>
			<div style={{ textAlign: "center" }}>
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
		</div>
	);
};

export default WorkerComponent;
