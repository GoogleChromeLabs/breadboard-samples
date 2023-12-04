import { ApiError } from "~/core/hooks/error-hooks";
import { SliceStatus } from "~/core/redux/slice-types";
import { StoriesState } from "~/hnStory/store-types";


export interface CoreState {
	error: ApiError | null;
	status: SliceStatus;
	mobileMenuOpen: boolean;
}

export type RootState = {
	stories: StoriesState;
}