import React, { useEffect, useState } from "react";
import WorkerManager from "./WorkerService.ts";

const worker: Worker = WorkerManager.getInstance();
export const WorkerComponent: React.FC = () => {
	const [dateTime, setDateTime] = useState("");
	const [iteration, setIteration] = useState(0);

	useEffect(() => {
		worker.onmessage = (event) => {
			if (event.data.currentDateTime) {
				setDateTime(event.data.currentDateTime);
			}
			if (event.data.iteration) {
				setIteration(event.data.iteration);
			}
		};
	}, []);

	const startLoop = () => {
		worker.postMessage({
			command: "start",
		});
	};

	const pauseLoop = () => {
		worker.postMessage({
			command: "pause",
		});
	};

	const stopLoop = () => {
		worker.postMessage({
			command: "stop",
		});
	};

	// const requestDateTime = () => {
	// 	worker.postMessage("getCurrentDateTime");
	// };

	// requestDateTime(); // You can call this function based on specific events or user actions

	console.log("main", dateTime);
	return (
		<div>
			<button onClick={startLoop}>Start</button>
			<button onClick={pauseLoop}>Pause</button>
			<button onClick={stopLoop}>Stop</button>
			<p>Current Date Time from Worker: {dateTime}</p>
		</div>
	);
};

export default WorkerComponent;
