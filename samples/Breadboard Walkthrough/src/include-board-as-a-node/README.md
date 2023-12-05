# Include Board as a Node

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
include1[["include <br> id='include-1'"]]:::include -- "nestedOutput->nestedOutput" --> mainOutputNode{{"output <br> id='mainOutputNode'"}}:::output
mainInputNode[/"input <br> id='mainInputNode'"/]:::input -- "mainInput->nestedInput" --> include1[["include <br> id='include-1'"]]:::include
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
	"title": "Include Board as a Node",
	"edges": [
		{
			"from": "include-1",
			"to": "mainOutputNode",
			"out": "nestedOutput",
			"in": "nestedOutput"
		},
		{
			"from": "mainInputNode",
			"to": "include-1",
			"out": "mainInput",
			"in": "nestedInput"
		}
	],
	"nodes": [
		{
			"id": "mainInputNode",
			"type": "input"
		},
		{
			"id": "include-1",
			"type": "include",
			"configuration": {
				"graph": {
					"title": "Nested Board",
					"edges": [
						{
							"from": "nestedInputNode",
							"to": "nestedOutputNode",
							"out": "nestedInput",
							"in": "nestedOutput"
						}
					],
					"nodes": [
						{
							"id": "nestedInputNode",
							"type": "input"
						},
						{
							"id": "nestedOutputNode",
							"type": "output"
						}
					],
					"kits": []
				}
			}
		},
		{
			"id": "mainOutputNode",
			"type": "output"
		}
	],
	"kits": [
		{
			"url": "npm:@google-labs/core-kit"
		}
	]
}
```