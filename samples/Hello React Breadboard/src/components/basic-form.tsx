import { Button, Card, Form, Input } from "antd";
import { Board } from "@google-labs/breadboard";
import { useState } from "react";
import OutputCard, { OutputCardProps } from "./output-card";

type FieldType = {
	// id: string;
	// blah: string;
	// nodeId: string;
	input: string;
	// inputTwoParam: string;
};

// const inputNodeOne = {
// 	id: "input-one",
// 	name: "partOne",
// };

// const inputNodeTwo = {
// 	id: "input-two",
// 	name: "partTwo",
// };

const inputAttribute = "message";

const BasicForm = (): React.JSX.Element => {
	// const [nodeState, setNodeOutput] = useState<OutputCardProps>({ key: wireAttribute, output: {} });
	const [nodeState, setNodeState] = useState<OutputCardProps>({
		nodeData: {},
	});
	console.log("nodeOutput", JSON.stringify(nodeState, null, 2));
	const board = new Board({
		title: "new board",
	});

	const onSubmit = async (values: FieldType) => {
		const input = board.input();
		const output = board.output();

		input.wire(inputAttribute, output);

		// const inputOne = board.input({
		// 	$id: inputNodeOne.id,
		// });
		// inputOne.wire(inputNodeOne.name, output);

		// const inputTwo = board.input({
		// 	$id: inputNodeTwo.id,
		// });
		// inputTwo.wire(inputNodeTwo.name, output);

		for await (const run of board.run()) {
			// console.log("run");
			if (run.type === "input") {
				run.inputs = {
					[inputAttribute]: values.input,
				};
				// if (run.node.id == inputNodeOne.id) {
				// 	run.inputs = {
				// 		[inputNodeOne.name]: values.inputOneParam
				// 	}
				// }
				// if (run.node.id == inputNodeTwo.id) {
				// 	run.inputs = {
				// 		[inputNodeTwo.name]: values.inputTwoParam
				// 	}
				// }
				// run.inputs = {
				// 	message: `The post ID is ${values.id}!`,
				// };
			} else if (run.type === "output") {
				// setNodeOutput(JSON.stringify(run.outputs, null, 2));
				setNodeState({
					nodeData: {
						node: run.node,
						outputs: run.outputs,
						inputs: run.inputs,
					},
				});
			}
		}
	};

	return (
		<>
			<Card title="Submit post ID">
				<Form
					name="basic"
					style={{
						maxWidth: 600,
						display: "flex",
						alignItems: "center",
						margin: "3em",
					}}
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

					{/* <Form.Item<FieldType>
					label="Node ID"
					name="nodeId"
					rules={[{ required: false }]}
				>
					<Input /> */}
					{/* </Form.Item> */}
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
