import styles from "./layouts.module.scss";

type MainLayoutProps = {
	children: React.ReactNode;
};
const MainLayout = ({ children }: MainLayoutProps): React.JSX.Element => {
	return (
		<div className={[styles.main].join(" ")} data-cy="MainLayout">
			{children}
		</div>
	);
};

export default MainLayout;
