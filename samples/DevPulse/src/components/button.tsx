import styles from "./button.module.scss";

type ButtonProps = {
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "danger";
	className?: string;
};
const Button = ({
	children,
	type,
	onClick,
	disabled = false,
	variant = "primary",
	className,
}: ButtonProps): React.JSX.Element => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={[styles.button, styles[variant], className].join(" ")}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
