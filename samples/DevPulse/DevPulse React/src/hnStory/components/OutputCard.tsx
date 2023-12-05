import { intlFormatDate } from "~/hnStory/hooks/useFormattedDate";
import "./OutputCard.css";
import { StoryOutput } from "~/hnStory/domain";
import { Spin } from "antd";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type OutputNodeProps = {
	nodeId?: string;
	data: StoryOutput[];
};

const OutputNode = ({ data }: OutputNodeProps): React.JSX.Element => {

	const dataString = JSON.stringify(data, null, 2);
	const dataObject = JSON.parse(dataString);
	console.log(dataObject);


	return (
		<div className="outputContainer">
			{dataObject.map((result: StoryOutput, key: number) => (
				<section className="card" key={key}>
					<h3>{result.title}</h3>
					<h4>By {result.author}</h4>
					<p>URL:<a href={result.url}>{result.url}</a></p>
					<p>Created at: {intlFormatDate(result.created_at)}</p>
					<h4>Summary: </h4>{result.summary == "pending" ? <Spin /> : <p>{result.summary}</p>}
				</section>
			))}
		</div>
	);

};

export default OutputNode;

