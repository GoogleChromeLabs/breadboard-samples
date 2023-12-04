import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./store-types";
import type { AppDispatch } from "./store";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { Dispatch, useMemo, useState } from "react";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useReduxDispatch = (): ThunkDispatch<
	RootState,
	undefined,
	AnyAction
> &
	Dispatch<AnyAction> => useDispatch<AppDispatch>();
export type AppDispatchType = ReturnType<typeof useReduxDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export type AppDispatchStatus = "idle" | "loading" | "success" | "error";
export const appDispatchStatusValues: Record<string, AppDispatchStatus> = {
	loading: "loading",
	idle: "idle",
	success: "success",
	error: "error",
};

export const useAppDispatch = (): {
	isLoading: boolean;
	isIdle: boolean;
	isSuccess: boolean;
	isError: boolean;
	setStatusLoading: () => void;
	setStatusIdle: () => void;
	setStatusSuccess: () => void;
	setStatusError: () => void;
	dispatch: AppDispatchType;
} => {
	const [status, setStatus] = useState<AppDispatchStatus>(
		appDispatchStatusValues.idle
	);
	const dispatch = useReduxDispatch();

	const isLoading = useMemo(
		() => status === appDispatchStatusValues.loading,
		[status]
	);
	const isIdle = useMemo(
		() => status === appDispatchStatusValues.idle,
		[status]
	);
	const isSuccess = useMemo(
		() => status === appDispatchStatusValues.success,
		[status]
	);
	const isError = useMemo(
		() => status === appDispatchStatusValues.error,
		[status]
	);

	const setStatusLoading = (): void => {
		setStatus(appDispatchStatusValues.loading);
	};

	const setStatusIdle = (): void => {
		setStatus(appDispatchStatusValues.idle);
	};

	const setStatusSuccess = (): void => {
		setStatus(appDispatchStatusValues.success);
	};

	const setStatusError = (): void => {
		setStatus(appDispatchStatusValues.error);
	};

	return {
		dispatch,
		setStatusLoading,
		setStatusIdle,
		setStatusSuccess,
		setStatusError,
		isLoading,
		isIdle,
		isSuccess,
		isError,
	};
};
