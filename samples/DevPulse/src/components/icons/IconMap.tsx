import Bookmark from "./Bookmark";
import Heart from "./Heart";
import History from "./History";
import NoteAdd from "./NoteAdd";
import SettingsCog from "./SettingsCog";
import { IconComponent } from "./types";

export const IconMap: Record<string, IconComponent> = {
	heart: Heart,
	settingsCog: SettingsCog,
	noteAdd: NoteAdd,
	history: History,
	bookmark: Bookmark,
} as const;

export type IconName = keyof typeof IconMap;
