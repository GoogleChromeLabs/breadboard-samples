import React from "react";
import { useWorkerControllerContext } from "worker/useWorkerControllerContext.tsx";
import "./WorkerComponent.css";
import { InputNode, WorkerStatus } from "~/sw/types";
import OutputNode from "~/hnStory/components/OutputCard";
import { useDispatch, useSelector } from "react-redux";
import { StoryOutput } from "~/hnStory/domain";
import {
	selectInputValue,
	setApiKey,
	setSearchQuery,
} from "~/hnStory/inputSlice";
import { RootState } from "~/core/redux/store";

export const WorkerComponent: React.FC = () => {
	const { broadcastChannel, unregisterController } =
		useWorkerControllerContext();
	const dispatch = useDispatch();
	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		node: InputNode,
		attribute: string
	) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector("input");
		if (node === InputNode.searchQuery) {
			broadcastChannel.send({
				node,
				attribute,
				value: input?.value,
			});
			dispatch(setSearchQuery(input?.value));
		} else if (node === InputNode.claudeApiKey) {
			broadcastChannel.send({
				node,
				attribute,
				value: input?.value,
			});
			dispatch(setApiKey(input?.value));
		}
	};

	//const inputField = useSelector((state: RootState) => selectInput(state))
	const inputValue = useSelector((state: RootState) =>
		selectInputValue(state)
	);
	console.log(inputValue);
	return (
		<div className="container">
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
				{broadcastChannel.status === WorkerStatus.running && (
					<div className="formContainer">
						<form
							className="form"
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
							<div className="formInputs">
								<input
									type="text"
									placeholder={`${broadcastChannel.input?.node}`}
								/>

								<button type="submit">Submit</button>
							</div>
						</form>

						<button type="button" onClick={unregisterController}>
							Unregister Worker
						</button>
					</div>
				)}
			</div>
			<div>
				<OutputNode
					data={broadcastChannel.output as StoryOutput[]}
					nodeId="searchResultData"
				/>
			</div>
		</div>
	);
};

export default WorkerComponent;
