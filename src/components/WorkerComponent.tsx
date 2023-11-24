import React, { useEffect, useState } from "react";
import WorkerManager from "~/util/WorkerService";

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
