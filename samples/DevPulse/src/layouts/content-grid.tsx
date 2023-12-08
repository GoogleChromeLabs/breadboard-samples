import styles from "./layouts.module.scss";

type ContentGridProps = {
	children: React.ReactNode;
};
const ContentGrid = ({ children }: ContentGridProps): React.JSX.Element => {
	return (
		<div className={[styles.contentGrid].join(" ")} data-cy="ContentGrid">
			{children}
		</div>
	);
};

export default ContentGrid;
