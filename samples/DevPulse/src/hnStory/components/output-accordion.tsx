import styles from "./output-accordion.module.scss";
import { StoryOutput } from "~/hnStory/domain";
import OutputAccordionItem from "./output-accordion-item";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type OutputAccordionProps = {
	nodeId?: string;
	data: StoryOutput[];
};

const OutputAccordion = ({ data }: OutputAccordionProps): React.JSX.Element => {

	const dataString = JSON.stringify(data, null, 2);
	const dataObject = JSON.parse(dataString);
	console.log(dataObject);


	return (
		<div className={styles.container}>
			{dataObject.map((result: StoryOutput) => (
				<OutputAccordionItem result={result} key={result.story_id} />
			))}
		</div>
	);

};

export default OutputAccordion;

