import { intlFormatDate } from "~/hooks/date-time";
import "./OutputCard.css";
import { OutputComponentTypes, OutputNodeData } from "~/sw/types";

export type OutputNodeProps = {
	nodeType?: string;
	data: OutputNodeData;
};

const OutputNode = ({ data, nodeType }: OutputNodeProps): React.JSX.Element => {

	nodeType = nodeType || getComponentForNode(data);
	const dataString = JSON.stringify(data, null, 2);
	const dataObject = JSON.parse(dataString);

	const title = dataObject["output"].title;
	const author = dataObject["output"].author;
	const postUrl = dataObject["output"].url;
	const dateCreated = intlFormatDate(dataObject["output"].created_at);


	return (
		<>
			{nodeType === "searchResultData" &&
				(
					<section className="card">
						<h3>{title}</h3>
						<h4>By {author}</h4>
						<p>URL:<a href={postUrl}>{postUrl}</a></p>
						<p>Created at: {dateCreated}</p>
					</section>
				)
			}
			{nodeType === "summary" &&
				(
					<section className="card">
						<h4>Type: {dataObject["node"]}</h4>
						<p>URL:<a href={postUrl}>{postUrl}</a></p>
						<p>Completion: {dataObject["output"].completion}</p>
						<p>Created at: {dateCreated}</p>
					</section>
				)
			}
			{nodeType === "storyData" &&
				(
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
						{dataString}
					</pre>
				)
			}
		</>
	)
};

export default OutputNode;

const Fallback = "Hidden"

const NodeTypeMap: Map<string, OutputComponentTypes> = new Map()
NodeTypeMap.set("searchResultData", OutputComponentTypes.searchResultData)
NodeTypeMap.set("summary", OutputComponentTypes.summary)
NodeTypeMap.set("storyData", OutputComponentTypes.storyData)

function getComponentForNode(data: OutputNodeData): OutputComponentTypes | typeof Fallback {
	return NodeTypeMap.get(data["node"]) || Fallback
}
