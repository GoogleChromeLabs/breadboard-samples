import Icon from "./icons/Icon";
import styles from "./header.module.scss";

type HeaderProps = {
	className?: string;
};
const Header = ({ className = "header" }: HeaderProps): React.JSX.Element => {
	return (
		<header
			className={[className, styles.header].join(" ")}
			data-cy="Header"
		>
			<div className={styles.headerLogo}>
				<Icon
					name="heart"
					fill={getComputedStyle(
						document.documentElement
					).getPropertyValue("--theme-icon-color")}
				/>
				<h2>
					Dev<span>Pulse</span>
				</h2>
			</div>
			<nav>
				<Icon name="settingsCog" fill="white" />
			</nav>
		</header>
	);
};

export default Header;
