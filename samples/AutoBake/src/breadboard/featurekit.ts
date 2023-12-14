import { KitBuilder } from "@google-labs/breadboard/kits";
import { InputValues, NodeValue } from "@google-labs/breadboard";
import { list } from "@exadev/breadboard-kits/types";
import axios from "axios";
import * as cheerio from "cheerio";
import * as readline from 'readline/promises';

type featureContents = {
    overview: NodeValue
}

type feature = {
    id: NodeValue,
    name: NodeValue,
    summary: NodeValue,
    category: NodeValue
}

type featureOutput = {
    features: feature[]
}

export type getBlogsHTMLContentInput = list.List;
// based on stuff selected by user, extract the feature page and display data...
async function extractFeatureContents(id: string): Promise<featureContents> {
    const baseURL = "https://chromestatus.com/feature/"
    const featureURL = `${baseURL}${id}`

    const axiosInstance = axios.create()
    console.log(`Extracting Content from: ${featureURL}`)
    const response = await axiosInstance.get(featureURL)


    const selector = cheerio.load(response.data)
    const contents = selector("body").html()

    return Promise.resolve({ overview: contents })
}

export const FeatureKit = new KitBuilder({
    url: "npm@exadev/breadboard-kits/featureKit"
}).build({
    async extractFunction(input: InputValues): Promise<void> {
        const { list }: list.List = input as list.List;

        for (const url of list) {
            const response = await extractFeatureContents(url as string)

            console.log(response)
        }
    },
    // parse the dirty json stuff, so we can display it to the user and they can select which one they want
    // by id
    async parseFeatureJSON(input: InputValues): Promise<featureOutput> {
        const { list }: list.List = input as list.List;
        const features: Array<feature> = []

        for (const jsonString of list) {
            const json = JSON.parse(jsonString as string);
            const feature = { id: json["id"], name: json["name"], summary: json["summary"], category: json["category"] }
            features.push(feature)
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });


        try {
            for (const feature of features) {
                console.log(feature)
            }

            const answer = await rl.question('Please select an feature id to extract ', {
                signal: AbortSignal.timeout(10_000) // 10s timeout
            });

            switch (answer.toLowerCase()) {
                case 'y':
                    console.log('Super!');
                    break;
                case 'n':
                    console.log('Sorry! :(');
                    break;
                default:
                    console.log('Invalid answer!');
            }
        } finally {
            rl.close();
        }

        return Promise.resolve({ features })
    },
})

export type FeatureKit = InstanceType<typeof FeatureKit>;
export default FeatureKit;