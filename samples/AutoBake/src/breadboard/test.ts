/* eslint-disable @typescript-eslint/no-unused-vars */
import { getChromeStatusApiFeatures } from "./chromeStatusApiFeatures"
import chromeStatusFeaturesV2 from "./chromeStatusFeaturesV2"
import {FeatureKit} from "./featurekit"
import { Board } from "@google-labs/breadboard"

const board = new Board({title: "AutoBake"})
const featureKit = board.addKit(FeatureKit)
const parseJson = featureKit.parseFeatureJSON()

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


ids.wire("list", parseJson)

const features = await getChromeStatusApiFeatures()
const featureStrings = []

const featuresV2 = await chromeStatusFeaturesV2()
const featureV2Strings = []

for(const feature of features){
    const my_string = JSON.stringify(feature)

    featureStrings.push(my_string)
}

for(const feature of featuresV2){
    const my_string = JSON.stringify(feature)
    featureV2Strings.push(my_string)
}

await board.runOnce({
    list: featureStrings
})

await board.runOnce({list:featureV2Strings})