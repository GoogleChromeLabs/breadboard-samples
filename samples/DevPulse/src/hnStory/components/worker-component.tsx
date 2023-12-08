import React from "react";
import { useWorkerControllerContext } from "worker/useWorkerControllerContext.tsx";
import styles from "./worker-component.module.scss";
import { InputNode, WorkerStatus } from "~/sw/types";
import { StoryOutput } from "~/hnStory/domain";
import Button from "~/components/button";
import OutputAccordion from "~/hnStory/components/output-accordion";

export const WorkerComponent: React.FC = () => {
	const { broadcastChannel, unregisterController } =
		useWorkerControllerContext();
	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		node: InputNode,
		attribute: string
	) => {
		e.preventDefault();
		const input = (e.target as HTMLFormElement).querySelector("input");

		const inputObject = {
			node,
			attribute,
			value: input?.value,
		};
		broadcastChannel.send(inputObject);
	};
	const running = broadcastChannel.status === WorkerStatus.running;
	//const inputField = useSelector((state: RootState) => selectInput(state))

	return (
		<div>
			<header className={styles.header}>
				<h6>
					Service Worker{" "}
					<span>Status: {broadcastChannel.status}</span>
				</h6>
				<div className={styles.controls}>
					<Button onClick={broadcastChannel.start}>Start</Button>
					<Button
						onClick={broadcastChannel.pause}
						disabled={!running}
					>
						Pause
					</Button>
					<Button onClick={broadcastChannel.stop} disabled={!running}>
						Stop
					</Button>
					<Button
						type="button"
						onClick={unregisterController}
						variant="danger"
					>
						Unregister Worker
					</Button>
				</div>
			</header>

			<main className={styles.main}>
				{broadcastChannel.status === WorkerStatus.running && (
					<form
						className={styles.form}
						onSubmit={(e) =>
							handleSubmit(
								e,
								broadcastChannel.input?.node || "",
								broadcastChannel.input?.attribute || ""
							)
						}
					>
						<label htmlFor="input" className={styles.label}>
							{broadcastChannel.input?.message || ""}
						</label>

						<input
							type="text"
							name="input"
							placeholder={`${broadcastChannel.input?.node}`}
							className={styles.input}
						/>

						<Button type="submit" className={styles.button}>Submit</Button>
					</form>
				)}
			</main>

			<OutputAccordion
				data={broadcastChannel.output as StoryOutput[]}
				nodeId="searchResultData"
			/>
		</div>
	);
};

export default WorkerComponent;
