import { ApiError } from "~/core/hooks/error-hooks";
import { SliceStatus } from "~/core/redux/slice-types";
export interface CoreState {
	error: ApiError | null;
	status: SliceStatus;
	mobileMenuOpen: boolean;
}