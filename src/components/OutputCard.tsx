import { intlFormatDate } from "~/hooks/useFormattedDate";
import "./OutputCard.css";
import { OutputNodeData } from "~/sw/types";
import useCategoriseNodes from "~/hooks/useCategoriseNodes";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type OutputNodeProps = {
	nodeId?: string;
	data: OutputNodeData[];
};

const OutputNode = ({ data }: OutputNodeProps): React.JSX.Element => {

	const dataString = JSON.stringify(data, null, 2);
	const dataObject = JSON.parse(dataString);

	console.log(dataObject);

	const categoryArrays = useCategoriseNodes(dataObject);

	/* 	const getSummaries = (searchData: OutputNodeData[], summaries: OutputNodeData[]): OutputNodeData | undefined => {
			let matchSummary;
			summaries.map((summary) => {
				matchSummary = searchData.some((data) => data.output.story_id === summary.output.story_id)
			})
			console.log(matchSummary);
			return matchSummary;
		};
	
		console.log(getSummaries(categoryArrays.searchResultData, categoryArrays.summarisationData)); */


	return (
		<div>
			{
				categoryArrays.searchResultData.map((result) => (
					<section className="card">
						<h3>{result.output.title}</h3>
						<h4>By {result.output.author}</h4>
						<p>URL:<a href={result.output.url}>{result.output.url}</a></p>
						<p>Created at: {intlFormatDate(result.output.created_at)}</p>
					</section>
				))

			}
			{
				categoryArrays.summarisationData.map((result) => (
					<section className="card">
						<h4>Type: {result.node}</h4>
						<p>URL:<a href={result.output.url}>{result.output.url}</a></p>
						<p>Completion: {result.output.completion}</p>
						<p>Created at: {intlFormatDate(result.output.created_at)}</p>
					</section>
				))

			}
			{
				categoryArrays.debugData.map((result) => (
					<pre
						style={{
							backgroundColor: "black",
							whiteSpace: "pre-wrap",
							margin: "10px",
							padding: "20px",
							color: "#00FF00",
							fontFamily: 'Consolas, "Courier New", monospace',
							borderRadius: "15px",
							boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
							overflow: "auto",
							textAlign: "left",
						}}>
						{JSON.stringify(result, null, 2)}
					</pre>
				))

			}
		</div>);

};

export default OutputNode;
