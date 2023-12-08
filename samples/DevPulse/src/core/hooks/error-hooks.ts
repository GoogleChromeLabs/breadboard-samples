export type ErrorCode = number | string | undefined;

export type ApiError = {
	code: ErrorCode;
	title: string;
	description: string;
};

export type ErrorFactory = (errorCode?: ErrorCode) => ApiError;
export interface ErrorHook {
	error: ApiError;
	onErrorClose: () => void;
	handleError: (error: ErrorCode) => void;
}
