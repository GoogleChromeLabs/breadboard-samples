/* eslint-disable @typescript-eslint/no-unused-vars */
import { getChromeStatusApiFeatures } from "./chromeStatusApiFeatures"
import {FeatureKit} from "./featurekit"
import { Board } from "@google-labs/breadboard"

const board = new Board({title: "AutoBake"})
const featureKit = board.addKit(FeatureKit)
const getFeatureContent = featureKit.getFeatureContent()

const ids = board.input({
    $id: "featureIds",
    schema: {
        type: "object",
        properties: {
            text: {
                type: "list",
                title: "Text",
                description: "urls",
            },
        },
    },
});


ids.wire("list", getFeatureContent)

const features = await getChromeStatusApiFeatures()
const featureStrings = []

for(const feature of features){
    const my_string = JSON.stringify(feature)

    featureStrings.push(my_string)
}

await board.runOnce({
    list: featureStrings
})

console.log("DONE")
