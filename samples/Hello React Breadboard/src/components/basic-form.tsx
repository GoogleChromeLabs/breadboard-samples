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
		console.log(values.id);
		board.input().wire("*", board.output());
		console.log(
			await board.runOnce({
				message: "Hello Breadboard!",
			})
		);
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