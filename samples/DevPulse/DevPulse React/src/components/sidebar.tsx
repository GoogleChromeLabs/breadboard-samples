import SidebarButton from "./sidebar-button";
import styles from "./sidebar.module.scss";

const Sidebar = (): React.JSX.Element => {
	return (
		<div className={[styles.sidebar].join(" ")} data-cy="Sidebar">
			<SidebarButton icon="noteAdd" label="New Query" />
			<SidebarButton icon="history" label="Query History" />
			<SidebarButton icon="bookmark" label="Saved Results" />
		</div>
	);
};

export default Sidebar;
