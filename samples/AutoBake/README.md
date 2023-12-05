# DevPulse

```mermaid
%%{init: 'themeVariables': { 'fontFamily': 'Fira Code, monospace' }}%%
graph TD;
chromeStatusApiFeatures2["chromeStatusApiFeatures <br> id='chromeStatusApiFeatures-2'"] -- "features->list" --> pop3["pop <br> id='pop-3'"]
pop3["pop <br> id='pop-3'"] -- "item->object" --> spread4["spread <br> id='spread-4'"]
chromeStatusFeaturesV25["chromeStatusFeaturesV2 <br> id='chromeStatusFeaturesV2-5'"] -- "features->list" --> pop6["pop <br> id='pop-6'"]
pop6["pop <br> id='pop-6'"] -- "item->object" --> spread7["spread <br> id='spread-7'"]
pop6["pop <br> id='pop-6'"] -- "list->list" --> pop6["pop <br> id='pop-6'"]
chromeStatusApiFeatures2["chromeStatusApiFeatures <br> id='chromeStatusApiFeatures-2'"] -- "features->list" --o findAll8["findAll <br> id='findAll-8'"]
spread7["spread <br> id='spread-7'"] -- "id->filter" --> findAll8["findAll <br> id='findAll-8'"]
findAll8["findAll <br> id='findAll-8'"] -- all --> output9{{"output <br> id='output-9'"}}:::output
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
			"from": "chromeStatusApiFeatures-2",
			"to": "pop-3",
			"out": "features",
			"in": "list"
		},
		{
			"from": "pop-3",
			"to": "spread-4",
			"out": "item",
			"in": "object"
		},
		{
			"from": "chromeStatusFeaturesV2-5",
			"to": "pop-6",
			"out": "features",
			"in": "list"
		},
		{
			"from": "pop-6",
			"to": "spread-7",
			"out": "item",
			"in": "object"
		},
		{
			"from": "pop-6",
			"to": "pop-6",
			"out": "list",
			"in": "list"
		},
		{
			"from": "chromeStatusApiFeatures-2",
			"to": "findAll-8",
			"constant": true,
			"out": "features",
			"in": "list"
		},
		{
			"from": "spread-7",
			"to": "findAll-8",
			"out": "id",
			"in": "filter"
		},
		{
			"from": "findAll-8",
			"to": "output-9",
			"out": "*"
		}
	],
	"nodes": [
		{
			"id": "versions-1",
			"type": "versions"
		},
		{
			"id": "chromeStatusApiFeatures-2",
			"type": "chromeStatusApiFeatures"
		},
		{
			"id": "pop-3",
			"type": "pop"
		},
		{
			"id": "spread-4",
			"type": "spread"
		},
		{
			"id": "chromeStatusFeaturesV2-5",
			"type": "chromeStatusFeaturesV2"
		},
		{
			"id": "pop-6",
			"type": "pop"
		},
		{
			"id": "spread-7",
			"type": "spread"
		},
		{
			"id": "findAll-8",
			"type": "findAll",
			"configuration": {
				"field": "id"
			}
		},
		{
			"id": "output-9",
			"type": "output"
		}
	],
	"kits": [
		{
			"url": "npm:@exadev/breadboard-kits/chrome-status"
		},
		{
			"url": "npm:@exadev/breadboard-kits/array-filter"
		},
		{
			"url": "npm:@exadev/breadboard-kits/list"
		},
		{
			"url": "npm:@exadev/filterKit"
		},
		{
			"url": "npm:@exadev/breadboard-kits/kits/ObjectKit"
		}
	]
}
```