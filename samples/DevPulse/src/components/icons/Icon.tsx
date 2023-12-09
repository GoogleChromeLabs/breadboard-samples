import { IconName, IconMap } from "./IconMap";
type IconProps = {
	name: IconName;
	fill?: string;
	className?: string;
	size?: number;
};
const Icon = ({ name, size = 24, fill, className }: IconProps): React.JSX.Element => {
	const IconToRender = IconMap[name];
	return <IconToRender size={size} fill={fill} className={className} />;
};

export default Icon;
