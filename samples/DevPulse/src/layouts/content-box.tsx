import styles from "./layouts.module.scss";

type ContentBoxProps = {
	children: React.ReactNode;
};
const ContentBox = ({ children }: ContentBoxProps): React.JSX.Element => {
	return (
		<div className={[styles.contentBox].join(" ")} data-cy="ContentBox">
			{children}
		</div>
	);
};

export default ContentBox;
