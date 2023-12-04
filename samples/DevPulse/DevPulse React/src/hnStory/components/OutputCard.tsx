import { intlFormatDate } from "~/hnStory/hooks/useFormattedDate";
import "./OutputCard.css";
import { OutputNodeData } from "~/sw/types";
import useCategoriseNodes from "~/hnStory/hooks/useCategoriseNodes";
import useWorkerController from "~/worker/useWorkerController";
import { Spin } from "antd";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type OutputNodeProps = {
	nodeId?: string;
	data: OutputNodeData[];
};

const OutputNode = ({ data }: OutputNodeProps): React.JSX.Element => {

	const { status } = useWorkerController();

	const dataString = JSON.stringify(data, null, 2);
	const dataObject = JSON.parse(dataString);
	const categoryArrays = useCategoriseNodes(dataObject);


	return (
		<>
			{status === "finished" ? (<div>
				{
					categoryArrays.searchResultData.map((result, key) => (
						<section className="card" key={key}>
							<h3>{result.output.title}</h3>
							<h4>By {result.output.author}</h4>
							<p>URL:<a href={result.output.url}>{result.output.url}</a></p>
							<p>Created at: {intlFormatDate(result.output.created_at)}</p>
						</section>
					))

				}
				{
					categoryArrays.summarisationData.map((result, key) => (
						<section className="card" key={key}>
							<h4>Type: {result.node}</h4>
							<p>URL:<a href={result.output.url}>{result.output.url}</a></p>
							<p>Completion: {result.output.completion}</p>
							<p>Created at: {intlFormatDate(result.output.created_at)}</p>
						</section>
					))

				}
			</div>) :
				(<Spin tip="Loading" size="large">
					<div className="content" />
				</Spin>)}
		</>
	);

};

export default OutputNode;

