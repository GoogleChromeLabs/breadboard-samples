/* eslint-disable @typescript-eslint/no-unused-vars */
import {FeatureKit} from "./featurekit"

import { Board } from "@google-labs/breadboard"


const board = new Board({title: "AutoBake"})


const featureKit = board.addKit(FeatureKit)
const getContents = featureKit.extractFunction()

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

const id = "5181611197071360"

const featureIds = [id]

ids.wire("list->", getContents)

getContents.wire("*", board.output())

await board.runOnce({
    list: featureIds
})