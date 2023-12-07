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
			<Icon name="heart" fill="#505050" />
			<h2>
				Dev<span>Pulse</span>
			</h2>
		</header>
	);
};

export default Header;
