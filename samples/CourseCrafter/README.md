# CourseCrafter

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
promptDetails[/"input <br> id='promptDetails'"/]:::input -- "template->template" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
blogDetails[/"input <br> id='blogDetails'"/]:::input -- "url->url" --> getBlogContents["getBlogContentForTask <br> id='getBlogContents'"]
taskDetails[/"input <br> id='taskDetails'"/]:::input -- "model->model" --> getBlogContents["getBlogContentForTask <br> id='getBlogContents'"]
taskDetails[/"input <br> id='taskDetails'"/]:::input -- "task->task" --> getBlogContents["getBlogContentForTask <br> id='getBlogContents'"]
getBlogContents["getBlogContentForTask <br> id='getBlogContents'"] -- "blogContent->input" --> summaryLanguageModel["pipeline <br> id='summaryLanguageModel'"]
getBlogContents["getBlogContentForTask <br> id='getBlogContents'"] -- "model->model" --> summaryLanguageModel["pipeline <br> id='summaryLanguageModel'"]
getBlogContents["getBlogContentForTask <br> id='getBlogContents'"] -- "task->task" --> summaryLanguageModel["pipeline <br> id='summaryLanguageModel'"]
getBlogContents["getBlogContentForTask <br> id='getBlogContents'"] -- "blogContent->blogContent" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
summaryLanguageModel["pipeline <br> id='summaryLanguageModel'"] -- "output->summary" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
getBlogContents["getBlogContentForTask <br> id='getBlogContents'"] -- "blogContent->blogContent" --> outputCollector{{"output <br> id='outputCollector'"}}:::output
summaryLanguageModel["pipeline <br> id='summaryLanguageModel'"] -- "output->blogSummary" --> outputCollector{{"output <br> id='outputCollector'"}}:::output
secrets1("secrets <br> id='secrets-1'"):::secrets -- "CLAUDE_KEY->apiKey" --> claudeAPI["generateCompletion <br> id='claudeAPI'"]
claudePromptConstructor["template <br> id='claudePromptConstructor'"] -- "string->userQuestion" --> claudeAPI["generateCompletion <br> id='claudeAPI'"]
claudePromptConstructor["template <br> id='claudePromptConstructor'"] -- "string->userQuestion" --> outputCollector{{"output <br> id='outputCollector'"}}:::output
claudeAPI["generateCompletion <br> id='claudeAPI'"] -- "completion->claudeResponse" --> outputCollector{{"output <br> id='outputCollector'"}}:::output
classDef default stroke:#ffab40,fill:#fff2ccff,color:#000
classDef input stroke:#3c78d8,fill:#c9daf8ff,color:#000
classDef output stroke:#38761d,fill:#b6d7a8ff,color:#000
classDef passthrough stroke:#a64d79,fill:#ead1dcff,color:#000
classDef slot stroke:#a64d79,fill:#ead1dcff,color:#000
classDef config stroke:#a64d79,fill:#ead1dcff,color:#000
classDef secrets stroke:#db4437,fill:#f4cccc,color:#000
classDef slotted stroke:#a64d79
```

```json
{
	"title": "CourseCrafter",
	"edges": [
		{
			"from": "promptDetails",
			"to": "claudePromptConstructor",
			"out": "template",
			"in": "template"
		},
		{
			"from": "blogDetails",
			"to": "getBlogContents",
			"out": "url",
			"in": "url"
		},
		{
			"from": "taskDetails",
			"to": "getBlogContents",
			"out": "model",
			"in": "model"
		},
		{
			"from": "taskDetails",
			"to": "getBlogContents",
			"out": "task",
			"in": "task"
		},
		{
			"from": "getBlogContents",
			"to": "summaryLanguageModel",
			"out": "blogContent",
			"in": "input"
		},
		{
			"from": "getBlogContents",
			"to": "summaryLanguageModel",
			"out": "model",
			"in": "model"
		},
		{
			"from": "getBlogContents",
			"to": "summaryLanguageModel",
			"out": "task",
			"in": "task"
		},
		{
			"from": "getBlogContents",
			"to": "claudePromptConstructor",
			"out": "blogContent",
			"in": "blogContent"
		},
		{
			"from": "summaryLanguageModel",
			"to": "claudePromptConstructor",
			"out": "output",
			"in": "summary"
		},
		{
			"from": "getBlogContents",
			"to": "outputCollector",
			"out": "blogContent",
			"in": "blogContent"
		},
		{
			"from": "summaryLanguageModel",
			"to": "outputCollector",
			"out": "output",
			"in": "blogSummary"
		},
		{
			"from": "secrets-1",
			"to": "claudeAPI",
			"out": "CLAUDE_KEY",
			"in": "apiKey"
		},
		{
			"from": "claudePromptConstructor",
			"to": "claudeAPI",
			"out": "string",
			"in": "userQuestion"
		},
		{
			"from": "claudePromptConstructor",
			"to": "outputCollector",
			"out": "string",
			"in": "userQuestion"
		},
		{
			"from": "claudeAPI",
			"to": "outputCollector",
			"out": "completion",
			"in": "claudeResponse"
		}
	],
	"nodes": [
		{
			"id": "blogDetails",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "urls"
						}
					}
				}
			}
		},
		{
			"id": "promptDetails",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "urls"
						}
					}
				}
			}
		},
		{
			"id": "taskDetails",
			"type": "input",
			"configuration": {
				"schema": {
					"type": "object",
					"properties": {
						"text": {
							"type": "string",
							"title": "Text",
							"description": "model and task"
						}
					}
				}
			}
		},
		{
			"id": "getBlogContents",
			"type": "getBlogContentForTask"
		},
		{
			"id": "summaryLanguageModel",
			"type": "pipeline"
		},
		{
			"id": "claudePromptConstructor",
			"type": "template",
			"configuration": {
				"template": "Based on this summary and original text, give me code sample on how to achieve the discussed topic. Output result in markdown format, do not include the summary text in the output: /n{{summary}}/nthe original text is the following: /n{{blogContent}}"
			}
		},
		{
			"id": "outputCollector",
			"type": "output"
		},
		{
			"id": "secrets-1",
			"type": "secrets",
			"configuration": {
				"0": "CLAUDE_API_KEY"
			}
		},
		{
			"id": "claudeAPI",
			"type": "generateCompletion",
			"configuration": {
				"model": "claude-2",
				"url": "https://api.anthropic.com/v1/complete"
			}
		}
	],
	"kits": [
		{
			"url": "npm@exadev/breadboard-kits/CourseCrafter"
		},
		{
			"url": "npm:@xenova/transformers"
		},
		{
			"url": "npm:@paulkinlan/claude-breadboard-kit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/StringKit"
		},
		{
			"url": "npm:@google-labs/core-kit"
		},
		{
			"url": "npm:@google-labs/llm-starter"
		}
	]
}
```