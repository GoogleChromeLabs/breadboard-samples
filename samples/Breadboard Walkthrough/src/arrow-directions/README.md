# Arrow Directions

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
input2[/"input <br> id='input-2'"/]:::input -- "inputPartOne->inputPartOne" --> output1{{"output <br> id='output-1'"}}:::output
input2[/"input <br> id='input-2'"/]:::input -- "inputPartTwo->inputPartTwo" --> output1{{"output <br> id='output-1'"}}:::output
input2[/"input <br> id='input-2'"/]:::input -- "inputPartThree->inputPartThree" --> output1{{"output <br> id='output-1'"}}:::output
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
	"title": "Arrow Directions",
	"edges": [
		{
			"from": "input-2",
			"to": "output-1",
			"out": "inputPartOne",
			"in": "inputPartOne"
		},
		{
			"from": "input-2",
			"to": "output-1",
			"out": "inputPartTwo",
			"in": "inputPartTwo"
		},
		{
			"from": "input-2",
			"to": "output-1",
			"out": "inputPartThree",
			"in": "inputPartThree"
		}
	],
	"nodes": [
		{
			"id": "output-1",
			"type": "output"
		},
		{
			"id": "input-2",
			"type": "input"
		}
	],
	"kits": []
}
```