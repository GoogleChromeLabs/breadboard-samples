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
			<div id="output">
				{broadcastChannel.output.map((data, index) => (
					<pre
						key={index}
						style={{
							backgroundColor: "black",
							whiteSpace: "pre-wrap",
							margin: "10px",
							padding: "20px",
							color: "#00FF00",
							fontFamily: 'Consolas, "Courier New", monospace',
							borderRadius: "15px",
							boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
							overflow: "auto",
							textAlign: "left",
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
