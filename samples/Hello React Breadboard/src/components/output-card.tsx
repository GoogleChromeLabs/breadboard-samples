import { Card } from "antd";
import { OutputValues } from "@google-labs/breadboard";

export type OutputCardProps = {
	nodeData: OutputValues;
	// attribute: string;
};

const OutputCard = ({ nodeData }: OutputCardProps): React.JSX.Element => {
	// const parsedOutput = JSON.parse(output);
	const outputString = JSON.stringify(nodeData, null, 2);
	console.log(outputString);
	// console.log("key", attribute);
	// console.log("output", output);
	// const builtString = `${attribute}: ${output[attribute]}`;
	// console.log("builtString", builtString);
	// console.log(JSON.stringify(output, null, 2));

	return (
		<Card
			title="Output"
			style={{
				width: "300px",
			}}
		>
			{outputString}
		</Card>
	);
};

export default OutputCard;