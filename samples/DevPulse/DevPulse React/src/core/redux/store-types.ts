import { ApiError } from "~/core/hooks/error-hooks";
import { SliceStatus } from "~/core/redux/slice-types";
import { InputState, OutputState } from "~/hnStory/store-types";

export interface CoreState {
	error: ApiError | null;
	status: SliceStatus;
	mobileMenuOpen: boolean;
}

export type RootState = {
	input: InputState;
	output: OutputState;
}