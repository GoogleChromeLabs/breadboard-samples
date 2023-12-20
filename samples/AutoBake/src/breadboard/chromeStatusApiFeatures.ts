/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserView, ChromeBrowser } from "./chromeStatusFeaturesV2";
import { fetchDirtyJson } from "./fetchDirtyJson";

type UserAction = {
	by: string;
	when: string;
};

type Stage = {
	id: number;
	created: string;
	feature_id: number;
	stage_type: number;
	ot_description: string | null;
	display_name: string | null;
	intent_stage: number;
	pm_emails: string[];
	tl_emails: string[];
	ux_emails: string[];
	te_emails: string[];
	intent_thread_url: string | null;
	announcement_url: string | null;
	experiment_goals: string | null;
	experiment_risks: string | null;
	origin_trial_id: string | null;
	origin_trial_feedback_url: string | null;
	ot_action_requested: boolean;
	ot_approval_buganizer_component: string | null;
	ot_approval_criteria_url: string | null;
	ot_approval_group_email: string | null;
	ot_chromium_trial_name: string | null;
	ot_display_name: string | null;
	ot_documentation_url: string | null;
	ot_emails: string[];
	ot_feedback_submission_url: string | null;
	ot_has_third_party_support: boolean;
	ot_is_critical_trial: boolean;
	ot_is_deprecation_trial: boolean;
	ot_owner_email: string | null;
	ot_require_approvals: boolean;
	ot_webfeature_use_counter: string | null;
	extensions: any[]; // Define more specifically if possible
	experiment_extension_reason: string | null;
	ot_stage_id: string | null;
	finch_url: string | null;
	rollout_milestone: string | null;
	rollout_platforms: string[];
	rollout_details: string | null;
	rollout_impact: number;
	enterprise_policies: any[]; // Define more specifically if possible
	desktop_first: string | null;
	android_first: string | null;
	ios_first: string | null;
	webview_first: string | null;
	desktop_last: string | null;
	android_last: string | null;
	ios_last: string | null;
	webview_last: string | null;
};

type BrowserStatus = {
	text: string;
	val: number;
	milestone_str: string;
};

export type BrowserInfo = ChromeBrowser & {
	android?: string;
	// blink_components: string[];
	// bug: string;
	desktop?: string;
	// devrel: string[];
	// flag: boolean;
	// intervention: boolean;
	ios?: string;
	// origintrial: boolean;
	// owners: string[];
	// prefixed: boolean | null;
	// status: BrowserStatus;
	webview?: string;
};

type Browsers = {
	chrome: BrowserInfo;
	ff: Partial<BrowserView>;
	safari: Partial<BrowserView>;
	webdev: Partial<BrowserView>;
	other: Partial<BrowserView>;
};

type Standards = {
	spec: string;
	maturity: {
		text: string;
		short_text: string;
		val: number;
	};
};

export type ChromeStatusV1ApiFeature = {
	id: number;
	name: string;
	summary: string;
	blink_components: string[];
	star_count: number;
	search_tags: string[];
	created: UserAction;
	updated: UserAction;
	category: string;
	category_int: number;
	feature_notes: string | null;
	enterprise_feature_categories: any[]; // Define more specifically if possible
	stages: Stage[];
	accurate_as_of: string;
	creator_email: string;
	updater_email: string;
	owner_emails: string[];
	editor_emails: string[];
	cc_emails: string[];
	spec_mentor_emails: string[];
	unlisted: boolean;
	deleted: boolean;
	editors: string[];
	cc_recipients: string[];
	spec_mentors: string[];
	creator: string;
	feature_type: string;
	feature_type_int: number;
	intent_stage: string;
	intent_stage_int: number;
	active_stage_id: number;
	bug_url: string;
	launch_bug_url: string | null;
	new_crbug_url: string;
	screenshot_links: string[];
	breaking_change: boolean;
	flag_name: string | null;
	finch_name: string | null;
	non_finch_justification: string | null;
	ongoing_constraints: string | null;
	motivation: string;
	devtrial_instructions: string | null;
	activation_risks: string | null;
	measurement: string | null;
	availability_expectation: string | null;
	adoption_expectation: string | null;
	adoption_plan: string | null;
	initial_public_proposal_url: string | null;
	explainer_links: string[];
	requires_embedder_support: boolean;
	spec_link: string;
	api_spec: boolean;
	interop_compat_risks: string | null;
	all_platforms: string | null;
	all_platforms_descr: string | null;
	non_oss_deps: string | null;
	anticipated_spec_changes: string | null;
	security_risks: string;
	ergonomics_risks: string | null;
	wpt: boolean;
	wpt_descr: string;
	webview_risks: string | null;
	devrel_emails: string[];
	debuggability: string | null;
	doc_links: string[];
	sample_links: string[];
	prefixed: boolean | null;
	tags: string[];
	tag_review: string | null;
	tag_review_status: string;
	tag_review_status_int: number;
	security_review_status: string;
	security_review_status_int: number;
	privacy_review_status: string;
	privacy_review_status_int: number;
	updated_display: string;
	resources: {
		samples: string[];
		docs: string[];
	};
	comments: string | null;
	ff_views: number;
	safari_views: number;
	web_dev_views: number;
	browsers: Browsers;
	standards: Standards;
	is_released: boolean;
	is_enterprise_feature: boolean;
	experiment_timeline: string | null;
};

type ChromeStatusFeatures = {
	total_count: number;
	features: ChromeStatusV1ApiFeature[];
};

export async function chromeStatusApiFeatures(): Promise<ChromeStatusFeatures> {
	return (await fetchDirtyJson(
		"https://chromestatus.com/api/v0/features",
		")]}'\n"
	)) as Promise<ChromeStatusFeatures>;
}

export default chromeStatusApiFeatures;

export async function getChromeStatusApiFeatures() {
	const features = await chromeStatusApiFeatures();
	return features.features;
}

export async function getChromeStatusApiFeatureids() {
	const features = await getChromeStatusApiFeatures();
	const featureIds = features.map((feature) => feature.id);
	return featureIds;
}

export async function getChromeStatusV1Feature(
	id: number
): Promise<ChromeStatusV1ApiFeature | undefined> {
	const features = await getChromeStatusApiFeatures();
	const feature = features.find((feature) => feature.id === id);
	return feature;
}
