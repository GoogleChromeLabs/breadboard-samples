import { Button, Form, Input } from 'antd';
import { Board } from "@google-labs/breadboard";

type FieldType = {
	id: string;
};

const BasicForm = (): React.JSX.Element => {
	const board = new Board({
		title: "new board",
	});

	const onSubmit = async (values: FieldType) => {
		/* console.log(values.id);
		const input = board.input().wire("*", board.output());
		input.wire(values.id, board.output());

		const runOutput = await board.runOnce({
			input: "Hello world!",
		})
		console.log(
			runOutput
		); */
		console.log(values.id);

		const output = board.output();

		const inputOne = board.input();
		inputOne.wire("message", output);

		for await (const run of board.run()) {
			if (run.type === "input") {
				run.inputs = {
					message: `The post ID is ${values.id}!`,
				};
			} else if (run.type === "output") {
				console.log(run.outputs);
			}
		}

	};

	return (
		<Form
			name="basic"
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			autoComplete="off"
			onFinish={onSubmit}
		>
			<Form.Item<FieldType>
				label="Post ID"
				name="id"
				rules={[{ required: true, message: "Type in a story id." }]}
			>
				<Input />
			</Form.Item>
			<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}

export default BasicForm;