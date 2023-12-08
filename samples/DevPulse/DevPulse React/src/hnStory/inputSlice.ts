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
			if (state.input.node === "searchQuery") state.input = action.payload;
		},
		setApiKey: (state, action) => {
			if (state.input.node === "claudeApiKey") state.input = action.payload;
		},
		setInputObject: (state, action) => {
			state.input = action.payload as WorkerData;
			console.log(action.payload);
		},
		clearInput: (state) => {
			state.input.value = "";
		}
		
	},
});

export const selectInputObject = (state: RootState) => state.input.input;
export const { setSearchQuery, setApiKey, setInputObject, clearInput } = inputSlice.actions;
export default inputSlice.reducer;
