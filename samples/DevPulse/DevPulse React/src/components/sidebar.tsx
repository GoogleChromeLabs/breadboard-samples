import styles from "./sidebar.module.scss";

const Sidebar = (): React.JSX.Element => {
	return (
		<div className={[styles.sidebar].join(" ")} data-cy="Sidebar">
			Sidebar
		</div>
	);
};

export default Sidebar;
