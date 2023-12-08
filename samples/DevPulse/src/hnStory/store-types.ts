import { EntityState } from "@reduxjs/toolkit";
import { StoryOutput } from "~/hnStory/domain";
import { WorkerData } from "~/sw/types";

export type InputState = EntityState<WorkerData>;
export type OutputState = EntityState<StoryOutput>;