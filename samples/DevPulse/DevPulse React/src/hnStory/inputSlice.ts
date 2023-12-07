import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/core/redux/store";
import { WorkerData } from "~/sw/types";

const initialState = {
	input: {
		node: "",
		attribute: "",
		message: "",
		value: ""
	} as WorkerData
}

const inputSlice = createSlice({
	name: "input",
	initialState: initialState,
	reducers: {
		setSearchQuery: (state, action) => {
			if (state.input.node === "searchQuery") state.input.value = action.payload;
		},
		setApiKey: (state, action) => {
			if (state.input.node === "claudeApiKey") state.input.value = action.payload;
		},
		clearInput: (state) => {
			state.input.value = '';
		}
		
	},
});

export const selectInputValue = (state: RootState) => state.input.input.value;
export const { setSearchQuery, setApiKey, clearInput } = inputSlice.actions;
export default inputSlice.reducer;
