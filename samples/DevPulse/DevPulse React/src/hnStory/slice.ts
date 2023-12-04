import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { StoryOutput } from "~/hnStory/domain";
import { getStories } from "~/hnStory/thunks";

export const storiesCrudAdapter = createEntityAdapter<StoryOutput>();

const initialState = storiesCrudAdapter.getInitialState();

const storiesSlice = createSlice({
	name: "stories",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getStories.fulfilled, (state, action) => {
			storiesCrudAdapter.upsertMany(
				state,
				action.payload.map((story) => ({ ...story, story_id: story.story_id }))
			);
		});
	}
});

const { reducer } = storiesSlice;
export default reducer;
