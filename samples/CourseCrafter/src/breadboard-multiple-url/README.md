# CourseCrafter

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
promptDetails[/"input <br> id='promptDetails'"/]:::input -- "template->template" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
blogDetails[/"input <br> id='blogDetails'"/]:::input -- "list->list" --> getBlogsContent["getBlogsContent <br> id='getBlogsContent'"]
taskDetails[/"input <br> id='taskDetails'"/]:::input -- "model->model" --> summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"]
taskDetails[/"input <br> id='taskDetails'"/]:::input -- "task->task" --> summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"]
getBlogsContent["getBlogsContent <br> id='getBlogsContent'"] -- "blogOutput->inputs" --> summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"]
getBlogsContent["getBlogsContent <br> id='getBlogsContent'"] -- "blogOutput->blogContents" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
summaryLanguageModel["pipelineBulk <br> id='summaryLanguageModel'"] -- "summaries->summaries" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
readEnvVar1["readEnvVar <br> id='readEnvVar-1'"] -- "CLAUDE_API_KEY->CLAUDE_API_KEY" --> claudeAPI["generateCompletion <br> id='claudeAPI'"]
claudePromptConstructor["template <br> id='claudePromptConstructor'"] -- "string->text" --> claudeAPI["generateCompletion <br> id='claudeAPI'"]
claudeAPI["generateCompletion <br> id='claudeAPI'"] -- "completion->completion" --> output2{{"output <br> id='output-2'"}}:::output
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
			"to": "getBlogsContent",
			"out": "list",
			"in": "list"
		},
		{
			"from": "taskDetails",
			"to": "summaryLanguageModel",
			"out": "model",
			"in": "model"
		},
		{
			"from": "taskDetails",
			"to": "summaryLanguageModel",
			"out": "task",
			"in": "task"
		},
		{
			"from": "getBlogsContent",
			"to": "summaryLanguageModel",
			"out": "blogOutput",
			"in": "inputs"
		},
		{
			"from": "getBlogsContent",
			"to": "claudePromptConstructor",
			"out": "blogOutput",
			"in": "blogContents"
		},
		{
			"from": "summaryLanguageModel",
			"to": "claudePromptConstructor",
			"out": "summaries",
			"in": "summaries"
		},
		{
			"from": "readEnvVar-1",
			"to": "claudeAPI",
			"out": "CLAUDE_API_KEY",
			"in": "CLAUDE_API_KEY"
		},
		{
			"from": "claudePromptConstructor",
			"to": "claudeAPI",
			"out": "string",
			"in": "text"
		},
		{
			"from": "claudeAPI",
			"to": "output-2",
			"out": "completion",
			"in": "completion"
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
							"type": "list",
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
			"id": "getBlogsContent",
			"type": "getBlogsContent"
		},
		{
			"id": "summaryLanguageModel",
			"type": "pipelineBulk"
		},
		{
			"id": "claudePromptConstructor",
			"type": "template"
		},
		{
			"id": "claudeAPI",
			"type": "generateCompletion",
			"configuration": {
				"model": "claude-2",
				"url": "https://api.anthropic.com/v1/complete"
			}
		},
		{
			"id": "readEnvVar-1",
			"type": "readEnvVar",
			"configuration": {
				"key": "CLAUDE_API_KEY"
			}
		},
		{
			"id": "output-2",
			"type": "output"
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
			"url": "npm:@exadev/breadboard-kits/kits/ConfigKit"
		}
	]
}
```