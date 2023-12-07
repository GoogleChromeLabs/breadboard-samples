import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/core/redux/store";
import { StoryOutput } from "~/hnStory/domain";

const initialState = {
	output: [] as StoryOutput[],
	isLoading: false
};

const outputSlice = createSlice({
	name: "output",
	initialState: initialState,
	reducers: {
		outputSuccess: (state, action) => {
			state.isLoading = true;
			state.output = action.payload;
			state.isLoading = false;
		}
	},
});

export const selectOutput = (state: RootState) => state.output;
export const { outputSuccess } = outputSlice.actions;
export default outputSlice.reducer;


