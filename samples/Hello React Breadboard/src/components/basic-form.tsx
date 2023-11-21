import { Button, Card, Form, Input } from "antd";
import { Board } from "@google-labs/breadboard";
import { useState } from "react";
import OutputCard, { OutputCardProps } from "./output-card";
import mainStyles from "../styles/main.module.scss";

type FieldType = {
	input: string;
};

const BasicForm = (): React.JSX.Element => {
	const [nodeState, setNodeState] = useState<OutputCardProps>({
		nodeData: {},
	});

	const board = new Board({
		title: "Basic board",
	});

	const inputAttribute = "message";

	const onSubmit = async (values: FieldType) => {
		//#region Board Wiring
		const input = board.input();
		const output = board.output();
		input.wire(inputAttribute, output);
		//#endregion

		//#region Board run logic
		for await (const run of board.run()) {
			if (run.type === "input") {
				run.inputs = {
					[inputAttribute]: values.input,
				};
			} else if (run.type === "output") {
				setNodeState({
					nodeData: {
						node: run.node,
						outputs: run.outputs,
						inputs: run.inputs,
					},
				});
			}
		}
		//#endregion
	};

	return (
		<>
			<Card title="Submit post ID">
				<Form
					name="basic"
					className={mainStyles.basicForm}
					initialValues={{ remember: true }}
					autoComplete="off"
					onFinish={onSubmit}
				>
					<Form.Item<FieldType>
						label="ID"
						name="input"
						rules={[{ required: false }]}
					>
						<Input />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Card>
			{nodeState && <OutputCard nodeData={nodeState.nodeData} />}
		</>
	);
};

export default BasicForm;
