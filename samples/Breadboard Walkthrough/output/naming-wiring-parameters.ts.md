# naming-wiring-parameters.ts

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
inputNode[/"input <br> id='inputNode'"/]:::input -- "inputPartOne->inputPartOne" --> outputNode{{"output <br> id='outputNode'"}}:::output
inputNode[/"input <br> id='inputNode'"/]:::input -- "inputPartTwo->renamedOutput" --> renamedOutputNode{{"output <br> id='renamedOutputNode'"}}:::output
inputNode[/"input <br> id='inputNode'"/]:::input -- all --> outputAll{{"output <br> id='outputAll'"}}:::output
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
	"title": "naming-wiring-parameters.ts",
	"edges": [
		{
			"from": "inputNode",
			"to": "outputNode",
			"out": "inputPartOne",
			"in": "inputPartOne"
		},
		{
			"from": "inputNode",
			"to": "renamedOutputNode",
			"out": "inputPartTwo",
			"in": "renamedOutput"
		},
		{
			"from": "inputNode",
			"to": "outputAll",
			"out": "*"
		}
	],
	"nodes": [
		{
			"id": "inputNode",
			"type": "input"
		},
		{
			"id": "outputNode",
			"type": "output"
		},
		{
			"id": "renamedOutputNode",
			"type": "output"
		},
		{
			"id": "outputAll",
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