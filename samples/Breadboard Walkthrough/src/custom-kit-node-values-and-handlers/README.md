# Custom Kit Node Values and Handlers Demo

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
inputNode[/"input <br> id='inputNode'"/]:::input -- "inputPartOne->inputPartOne" --> echo1["echo <br> id='echo-1'"]
echo1["echo <br> id='echo-1'"] -- "inputPartOne->echoedInput" --> echoOutput{{"output <br> id='echoOutput'"}}:::output
inputNode[/"input <br> id='inputNode'"/]:::input -- "inputPartOne->a" --> concat2["concat <br> id='concat-2'"]
inputNode[/"input <br> id='inputNode'"/]:::input -- "inputPartTwo->b" --> concat2["concat <br> id='concat-2'"]
concat2["concat <br> id='concat-2'"] -- "value->concatenatedInput" --> concatOutput{{"output <br> id='concatOutput'"}}:::output
inputNode[/"input <br> id='inputNode'"/]:::input -- "inputPartThree->input" --> split3["split <br> id='split-3'"]
split3["split <br> id='split-3'"] -- "value->splitInput" --> splitOutput{{"output <br> id='splitOutput'"}}:::output
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
	"title": "Custom Kit Node Values and Handlers Demo",
	"edges": [
		{
			"from": "inputNode",
			"to": "echo-1",
			"out": "inputPartOne",
			"in": "inputPartOne"
		},
		{
			"from": "echo-1",
			"to": "echoOutput",
			"out": "inputPartOne",
			"in": "echoedInput"
		},
		{
			"from": "inputNode",
			"to": "concat-2",
			"out": "inputPartOne",
			"in": "a"
		},
		{
			"from": "inputNode",
			"to": "concat-2",
			"out": "inputPartTwo",
			"in": "b"
		},
		{
			"from": "concat-2",
			"to": "concatOutput",
			"out": "value",
			"in": "concatenatedInput"
		},
		{
			"from": "inputNode",
			"to": "split-3",
			"out": "inputPartThree",
			"in": "input"
		},
		{
			"from": "split-3",
			"to": "splitOutput",
			"out": "value",
			"in": "splitInput"
		}
	],
	"nodes": [
		{
			"id": "echo-1",
			"type": "echo"
		},
		{
			"id": "concat-2",
			"type": "concat"
		},
		{
			"id": "split-3",
			"type": "split"
		},
		{
			"id": "inputNode",
			"type": "input"
		},
		{
			"id": "echoOutput",
			"type": "output"
		},
		{
			"id": "concatOutput",
			"type": "output"
		},
		{
			"id": "splitOutput",
			"type": "output"
		}
	],
	"kits": [
		{
			"url": "npm:my-custom-kit"
		}
	]
}
```