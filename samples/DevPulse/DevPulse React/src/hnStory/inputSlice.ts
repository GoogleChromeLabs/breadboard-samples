import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/core/redux/store";
import { WorkerData } from "~/sw/types";


const inputSlice = createSlice({
	name: "input",
	initialState: {
		input: {
			node: "",
			attribute: "",
			message: "",
			value: undefined
		} as WorkerData
	},
	reducers: {
		setInputValue: (state, action) => {
			state.input.value = action.payload;
		}
	},
});

const { reducer } = inputSlice;
export const selectInput = (state: RootState) => state.inputReducer;
export const { setInputValue } = inputSlice.actions;
export default reducer;
