import { BaseDTO } from "~/core/base-dto";

export interface StoryOutput extends BaseDTO {
	story_id: number;
	title: string;
	url: string;
	author: string;
	created_at: Date;
	created_at_i: Date;
	points: number;
	hnUrl: string;
	summary?: string;
}