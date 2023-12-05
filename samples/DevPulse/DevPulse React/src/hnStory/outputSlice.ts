import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/core/redux/store";
import { StoryOutput } from "~/hnStory/domain";

const outputSlice = createSlice({
	name: "output",
	initialState: {
		output: [] as StoryOutput[],
		isLoading: false
	},
	reducers: {
		outputSuccess: (state, action) => {
			state.isLoading = true;
			state.output = action.payload;
			state.isLoading = false;
		}
	},
});

const { reducer } = outputSlice;
export const selectOutput = (state: RootState) => state.outputReducer;
export const { outputSuccess } = outputSlice.actions;
export default reducer;


