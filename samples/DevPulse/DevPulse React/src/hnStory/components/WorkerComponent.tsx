import React from "react";
import { useWorkerControllerContext } from "worker/useWorkerControllerContext.tsx";
import "./WorkerComponent.css";
import { OutputNodeData, WorkerStatus } from "~/sw/types";
import OutputNode from "~/hnStory/components/OutputCard";

export const WorkerComponent: React.FC = () => {
	const { broadcastChannel, unregisterController } = useWorkerControllerContext();

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
		<div
			className="container"
			style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
		>
			<div className="content">
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
				<div
					style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
				>
					{broadcastChannel.status === WorkerStatus.running && (
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
								{broadcastChannel.input?.message || ""}
							</label>
							<br />
							<input
								type="text"
								placeholder={`${broadcastChannel.input?.node}.${broadcastChannel.input?.attribute}`}
							/>
							<button type="submit">Submit</button>
						</form>
					)}
					<button type="button" onClick={unregisterController}>Unregister Worker</button>
				</div>
			</div>
			<div className="content" id="output">
				<OutputNode
					data={broadcastChannel.output as OutputNodeData[]}
					nodeId="searchResultData"
				/>
			</div>
		</div>
	);
};

export default WorkerComponent;
