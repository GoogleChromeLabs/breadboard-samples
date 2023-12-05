import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoryOutput } from "~/hnStory/domain";
import { Stories } from "~/core/Stories";

export const getStories = createAsyncThunk<
	StoryOutput[],
	void
>("stories/getStories", async () => {

	const response = Stories.getAll() as unknown[] as StoryOutput[];
	return response;
});