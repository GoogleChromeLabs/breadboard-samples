# AutoBake

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
features[/"input <br> id='features'"/]:::input -- "list->list" --> featureResources["getFeatureContent <br> id='featureResources'"]
featureResources["getFeatureContent <br> id='featureResources'"] -- "featureContents->featureContents" --> claudePromptConstructor["template <br> id='claudePromptConstructor'"]
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
	"title": "AutoBake",
	"edges": [
		{
			"from": "features",
			"to": "featureResources",
			"out": "list",
			"in": "list"
		},
		{
			"from": "featureResources",
			"to": "claudePromptConstructor",
			"out": "featureContents",
			"in": "featureContents"
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
			"id": "features",
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
			"id": "featureResources",
			"type": "getFeatureContent"
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
			"id": "claudePromptConstructor",
			"type": "template",
			"configuration": {
				"template": "Based on these documents, give me a script that can be used to teach a junior developer about the discussed topic in the document, output in markdown format?:/n{{featureContents}}"
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
			"url": "npm@exadev/breadboard-kits/featureKit"
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