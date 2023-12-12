# index.ts

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
inputOne[/"input <br> id='inputOne'"/]:::input -- "message->message" --> output1{{"output <br> id='output-1'"}}:::output
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
	"title": "index.ts",
	"edges": [
		{
			"from": "inputOne",
			"to": "output-1",
			"out": "message",
			"in": "message"
		}
	],
	"nodes": [
		{
			"id": "inputOne",
			"type": "input"
		},
		{
			"id": "output-1",
			"type": "output"
		}
	],
	"kits": []
}
```