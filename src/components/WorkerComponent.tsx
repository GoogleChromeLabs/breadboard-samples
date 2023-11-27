import React from "react";
import { useWorkerControllerContext } from "worker/useWorkerControllerContext.tsx";

export const WorkerComponent: React.FC = () => {
	const { broadcastChannel } = useWorkerControllerContext();

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		node: string,
		attribute: string
	) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector("input");
		broadcastChannel.send({
			node,
			attribute,
			value: input?.value,
		});
	};

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<p>Status: {broadcastChannel.status}</p>
			<div>
				<button
					style={{
						marginRight: "10px",
						padding: "10px 20px",
						cursor: "pointer",
					}}
					onClick={broadcastChannel.start}
				>
					Start
				</button>
				<button
					style={{
						marginRight: "10px",
						padding: "10px 20px",
						cursor: "pointer",
					}}
					onClick={broadcastChannel.pause}
				>
					Pause
				</button>
				<button
					style={{ padding: "10px 20px", cursor: "pointer" }}
					onClick={broadcastChannel.stop}
				>
					Stop
				</button>
			</div>
			<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
				{broadcastChannel.input && (
					<form
						onSubmit={(e) =>
							handleSubmit(
								e,
								broadcastChannel.input?.node || "",
								broadcastChannel.input?.attribute || ""
							)
						}
					>
						<label htmlFor="">
							{broadcastChannel.input.message}
						</label>
						<br />
						<input
							type="text"
							placeholder={`${broadcastChannel.input.node}.${broadcastChannel.input.attribute}`}
						/>
						<button type="submit">Submit</button>
					</form>
				)}
			</div>
			<div
				style={{
					backgroundColor: "#282c34", // Dark background
					color: "#abb2bf", // Light text color
					fontFamily: 'Consolas, "Courier New", monospace', // Monospaced font
					padding: "20px",
					borderRadius: "5px",
					boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
					overflow: "auto",
					textAlign: "left",
				}}
			>
				{broadcastChannel.output.map((data, index) => (
					<pre
						key={index}
						style={{
							whiteSpace: "pre-wrap",
							margin: "0",
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
