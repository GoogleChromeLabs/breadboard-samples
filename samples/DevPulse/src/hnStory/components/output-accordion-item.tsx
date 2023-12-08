import { Spin } from "antd";
import { StoryOutput } from "../domain";
import { intlFormatDate } from "../hooks/useFormattedDate";
import styles from "./output-accordion.module.scss";
import { useState } from "react";

type OutputAccordionItemProps = {
	result: StoryOutput;
};

const OutputAccordionItem = ({
	result,
}: OutputAccordionItemProps): React.JSX.Element => {
	const [open, setOpen] = useState(false);
	const handleClick = () => {
		setOpen(!open);
	};
	return (
		<section
			className={[styles.card, open ? styles.open : undefined].join(" ")}
			key={result.story_id}
		>
			<h3 onClick={handleClick}>
				<span>
					<a href={result.url} target="_blank">
						{result.title}
					</a>
				</span>
				{result.summary == "pending" ? <Spin className={styles.spinnerWhite} /> : <span>Complete</span>}
			</h3>
			<div className={styles.cardDetails}>
				<dl className={styles.meta}>
					<dt>Created</dt>
					<dd>{intlFormatDate(result.created_at)}</dd>
					<dt>Author</dt>
					<dd>{result.author}</dd>
				</dl>
				<h4>Summary</h4>
				<div className={styles.summary}>
					{result.summary == "pending" ? (
						<Spin />
					) : (
						<p>{result.summary}</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default OutputAccordionItem;
