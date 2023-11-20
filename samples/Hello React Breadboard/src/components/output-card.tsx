import { Card } from "antd";
import { OutputValues } from "@google-labs/breadboard";

export type OutputCardProps = {
	output: OutputValues;
	attribute: string;
};

const OutputCard = ({ output, attribute }: OutputCardProps): React.JSX.Element => {
	// const parsedOutput = JSON.parse(output);
	const outputString = JSON.stringify(output, null, 2);
	console.log(outputString);
	console.log("key", attribute);
	console.log("output", output);
	const builtString = `${attribute}: ${output[attribute]}`;
	console.log("builtString", builtString);
	// console.log(JSON.stringify(output, null, 2));

	return (
		<Card
			title="Output"
			style={{
				width: "300px",
			}}
		>
			{`${attribute}: ${output[attribute]}`}
		</Card>
	);
};

export default OutputCard;