import Heart from "./Heart";
import { IconComponent } from "./types";

export const IconMap: Record<string, IconComponent> = {
	'heart': Heart
} as const;

export type IconName = keyof typeof IconMap;
