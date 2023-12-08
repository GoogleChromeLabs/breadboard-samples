import { type } from "os";
import styles from "./sidebar-button.module.scss";
import { IconName } from "./icons/IconMap";
import Icon from "./icons/Icon";
import React, { useRef } from "react";

type SidebarButtonProps = {
	icon: IconName;
	label: string;
	onClick?: () => void;
};

const SidebarButton = ({
	icon,
	label,
	onClick,
}: SidebarButtonProps): React.JSX.Element => {
	const [hovered, setHovered] = React.useState(false);
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (onClick) {
			onClick();
		}
	};

	const handleMouseEnter = () => {
		setHovered(true);
	}

	const handleMouseLeave = () => {
		setHovered(false);
	}
	
	const iconColor = getComputedStyle(document.documentElement).getPropertyValue(hovered ? "--theme-tertiary-color" : "--theme-color");
	return (
		<button
			className={[styles.button].join(" ")}
			data-cy="SidebarButton"
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<span className={styles.icon}>
				<Icon name={icon} fill={iconColor} />
			</span>
			<span>{label}</span>
		</button>
	);
};

export default SidebarButton;
