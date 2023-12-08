import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/core/redux/store";
import { StoryOutput } from "~/hnStory/domain";
import { WorkerStatus } from "~/sw/types";

const initialState = {
	output: [] as StoryOutput[],
	status: WorkerStatus
};

const outputSlice = createSlice({
	name: "output",
	initialState: initialState,
	reducers: {
		outputSuccess: (state, action) => {
			state.output = action.payload;
		}
	},
});

export const selectOutput = (state: RootState) => state.output.output;
export const { outputSuccess } = outputSlice.actions;
export default outputSlice.reducer;


