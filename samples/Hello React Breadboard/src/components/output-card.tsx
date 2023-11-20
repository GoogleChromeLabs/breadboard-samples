import { Card } from "antd";
import { OutputValues } from "@google-labs/breadboard";
import mainStyles from "../styles/main.module.scss";

export type OutputCardProps = {
	nodeData: OutputValues;
};

const OutputCard = ({ nodeData }: OutputCardProps): React.JSX.Element => {
	const outputString = JSON.stringify(nodeData, null, 2);

	return (
		<Card
			title="Output"
			className={mainStyles.outputCard}
		>
			<pre className={mainStyles.outputContent}>{outputString}</pre>
		</Card>
	);
};

export default OutputCard;