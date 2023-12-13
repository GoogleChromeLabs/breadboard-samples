# Multiple Outputs

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
input1[/"input <br> id='input-1'"/]:::input -- "partOne->partOne" --> outputOne{{"output <br> id='outputOne'"}}:::output
input1[/"input <br> id='input-1'"/]:::input -- "partTwo->partTwo" --> outputTwo{{"output <br> id='outputTwo'"}}:::output
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
	"title": "Multiple Outputs",
	"edges": [
		{
			"from": "input-1",
			"to": "outputOne",
			"out": "partOne",
			"in": "partOne"
		},
		{
			"from": "input-1",
			"to": "outputTwo",
			"out": "partTwo",
			"in": "partTwo"
		}
	],
	"nodes": [
		{
			"id": "outputOne",
			"type": "output"
		},
		{
			"id": "outputTwo",
			"type": "output"
		},
		{
			"id": "input-1",
			"type": "input"
		}
	],
	"kits": []
}
```