import styles from "./button.module.scss";

type ButtonProps = {
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
};
const Button = ({ children, type, onClick }: ButtonProps): React.JSX.Element => {
	return (
		<button type={type} onClick={onClick} className={styles.button}>
			{children}
		</button>
	);
};

export default Button;
