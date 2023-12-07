import React from "react";
import { useWorkerControllerContext } from "worker/useWorkerControllerContext.tsx";
import "./WorkerComponent.css";
import { WorkerStatus } from "~/sw/types";
import OutputNode from "~/hnStory/components/OutputCard";
import { useDispatch } from "react-redux";
import { StoryOutput } from "~/hnStory/domain";
import { setInputValue } from "~/hnStory/inputSlice";
import Button from "~/components/button";

export const WorkerComponent: React.FC = () => {
	const { broadcastChannel, unregisterController } =
		useWorkerControllerContext();
	const dispatch = useDispatch();
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
		dispatch(setInputValue(input?.value));
	};

	//const inputField = useSelector((state: RootState) => selectInput(state))

	return (
		<div className="container">
			<h2>Service Worker</h2>
			<div className="content">
				<p>Status: {broadcastChannel.status}</p>
				<div>
					<Button onClick={broadcastChannel.start}>Start</Button>
					<Button onClick={broadcastChannel.pause}>Pause</Button>
					<Button onClick={broadcastChannel.stop}>Stop</Button>
				</div>
				<div className="formContainer">
					{broadcastChannel.status === WorkerStatus.running && (
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

								<Button type="submit">Submit</Button>
							</div>
						</form>
					)}
					<Button type="button" onClick={unregisterController}>
						Unregister Worker
					</Button>
				</div>
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
