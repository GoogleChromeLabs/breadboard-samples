import styles from "./output-accordion.module.scss";
import { StoryOutput } from "~/hnStory/domain";
import OutputAccordionItem from "./output-accordion-item";
//import useComponentForNode from "~/hooks/useComponentForNode";

export type OutputAccordionProps = {
	nodeId?: string;
	data: StoryOutput[];
};

const OutputAccordion = ({ data }: OutputAccordionProps): React.JSX.Element => {
	return (
		<div className={styles.container}>
			{data.map((result: StoryOutput) => (
				<OutputAccordionItem result={result} key={result.story_id} />
			))}
		</div>
	);

};

export default OutputAccordion;

