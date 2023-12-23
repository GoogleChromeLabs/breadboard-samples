# Include Board as a Node with URL

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
invoke1["invoke <br> id='invoke-1'"] -- "nestedOutput->nestedOutput" --> mainOutputNode{{"output <br> id='mainOutputNode'"}}:::output
mainInputNode[/"input <br> id='mainInputNode'"/]:::input -- "mainInput->nestedInput" --> invoke1["invoke <br> id='invoke-1'"]
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
	"title": "Include Board as a Node with URL",
	"edges": [
		{
			"from": "invoke-1",
			"to": "mainOutputNode",
			"out": "nestedOutput",
			"in": "nestedOutput"
		},
		{
			"from": "mainInputNode",
			"to": "invoke-1",
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
			"id": "invoke-1",
			"type": "invoke",
			"configuration": {
				"path": "https://raw.githubusercontent.com/ExaDev-io/breadboard-samples/more-demos/samples/Breadboard%20Walkthrough/src/include-board-as-a-node-with-url/nestedboard.json"
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