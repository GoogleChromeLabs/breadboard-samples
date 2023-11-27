import claude from "@anthropic-ai/tokenizer/claude.json";
import { InputValues, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import { Tiktoken, TiktokenBPE } from "js-tiktoken";

export function countTokens(text: string): number {
	const tokenizer = getTokenizer();
	const encoded = tokenizer.encode(text.normalize("NFKC"));
	return encoded.length;
}

export function getTokenizer(): Tiktoken {
	const tiktokenBPE: TiktokenBPE = {
		pat_str: claude.pat_str,
		special_tokens: claude.special_tokens,
		bpe_ranks: claude.bpe_ranks,
	};
	return new Tiktoken(tiktokenBPE);
}

export type ClaudeResponse = {
	completion: string;
	stop_reason: "stop_sequence" | "max_tokens";
};

export const ClaudeKitBuilder = new KitBuilder({
	url: "npm:@exadev/breadboard-kits",
}).build({
	async complete(input: InputValues): Promise<OutputValues> {
		return postClaudeCompletion(input as ClaudeParams);
	},

	async countTokens(input: InputValues): Promise<OutputValues> {
		return Object.fromEntries(
			Object.entries(input)
				.filter(([, value]) => typeof value === "string")
				.map(([key, value]) => [key, countTokens(value as string)])
		);
	},
});

export async function postClaudeCompletion({
	apiKey,
	model,
	userQuestion,
	maxTokens,
	stopSequences,
	temperature,
	topP,
	topK,
	stream,
	url,
}: ClaudeParams): Promise<ClaudeResponse> {
	if (!apiKey) throw new Error("Missing apiKey");
	if (!userQuestion) throw new Error("Missing userQuestion");
	model = model || "claude-2";
	// Endpoint URL
	// const url = "https://api.anthropic.com/v1/complete";
	url = url || "https://api.anthropic.com/v1/complete";
	// Request headers
	const headers = {
		accept: "application/json",
		"anthropic-version": "2023-06-01",
		"content-type": "application/json",
		"x-api-key": apiKey,
	};

	// Constructing the prompt
	const prompt = `\n\nHuman: ${userQuestion}\n\nAssistant:`;

	const inputTokenCount = countTokens(prompt);
	const TOKEN_LIMIT = 100000;
	maxTokens = maxTokens || TOKEN_LIMIT - inputTokenCount;
	if (maxTokens < 0)
		throw new Error(
			`input token count ${inputTokenCount} exceeds token limit ${TOKEN_LIMIT}!`
		);

	// Request body
	const body = {
		model,
		prompt,
		max_tokens_to_sample: maxTokens,
		...(stopSequences && { stop_sequences: stopSequences }),
		...(temperature !== undefined && { temperature }),
		...(topP !== undefined && { top_p: topP }),
		...(topK !== undefined && { top_k: topK }),
		...(stream !== undefined && { metadata: { stream } }),
	};

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(body),
		});

		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`);

		return (await response.json()) as ClaudeResponse;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}
export type ClaudeParams = {
	apiKey: string;
	model: "claude-2" | "claude-instant-1";
	userQuestion: string;
	maxTokens: number;
	stopSequences?: string[];
	temperature?: number;
	topP?: number;
	topK?: number;
	stream?: boolean;
	url?: string;
};
