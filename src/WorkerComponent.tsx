import React, { useEffect, useState } from "react";
import WorkerManager from "./WorkerService.ts";

const worker: Worker = WorkerManager.getInstance();
export const WorkerComponent: React.FC = () => {
	const [dateTime, setDateTime] = useState("");

	useEffect(() => {
		worker.onmessage = (event) => {
			if (typeof event.data === "string") {
				setDateTime(event.data);
			}
		};
	}, []);

	const startLoop = () => {
		worker.postMessage("start");
	};

	const pauseLoop = () => {
		worker.postMessage("pause");
	};

	const stopLoop = () => {
		worker.postMessage("stop");
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
