import { intlFormatDate } from "~/hooks/date-time";
import "./OutputNode.css";

type OutputNodeProps = {
	nodeType: string;
	data: unknown;
};

const OutputNode = ({ data, nodeType }: OutputNodeProps): React.JSX.Element => {

	const dataString = JSON.stringify(data, null, 2);
	const dataObject = JSON.parse(dataString);

	const title = dataObject["output"].title;
	const author = dataObject["output"].author;
	const postUrl = dataObject["output"].url;
	const dateCreated = intlFormatDate(dataObject["output"].created_at);


	return (
		<>
			{
				dataObject["node"] === nodeType ?
					(<section className="card">
						<h3>{title}</h3>
						<h4>By {author}</h4>
						<p>URL:<a href={postUrl}>{postUrl}</a></p>
						<p>Created at: {dateCreated}</p>
					</section>) : (<p>{dataString}</p>)
			}
		</>
	)
};

export default OutputNode;