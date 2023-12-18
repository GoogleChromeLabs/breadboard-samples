/* eslint-disable no-constant-condition */
import { KitBuilder } from "@google-labs/breadboard/kits";
import { InputValues, NodeValue } from "@google-labs/breadboard";
import { list } from "@exadev/breadboard-kits/types";
import * as readline from 'readline/promises';
import fs from "fs";
import * as puppeteer from "puppeteer";

type featureContents = {
    overview: NodeValue
}

type feature = {
    id: NodeValue,
    name: NodeValue,
    summary: NodeValue,
    category: NodeValue,
    docs: NodeValue[],
    samples: NodeValue[]
}


export type getBlogsHTMLContentInput = list.List;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function extractFeatureContents(id: string): Promise<featureContents> {
    const browser = await puppeteer.launch({args: ['--no-sandbox'],});
    const page = await browser.newPage();

    const baseURL = "https://chromestatus.com/feature/"
    const featureURL = `${baseURL}${id}`
    console.log("Extracting Feature Content: ", featureURL)

    // Navigate the page to a URL
    await page.goto(featureURL, {waitUntil: 'load'});
    // sleep to wait for shadow DOM to render
    await sleep(5000);
    const element = await page.evaluateHandle(`document.querySelector("body > chromedash-app").shadowRoot.querySelector("#content-component-wrapper > chromedash-feature-page").shadowRoot.querySelector("sl-details")`)
    
    const contents = await page.evaluate(el => el.textContent, element);

    await browser.close()

    return Promise.resolve({ overview: contents })
}

// experimental, will used be used to extract docs and samples 
// maybe download the HTML and then ask LLM to infer what should be extracted
async function extractPageHTML(url: string): Promise<void>{
    const browser = await puppeteer.launch({args: ['--no-sandbox'],});
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: 'load'});
    // sleep to wait for shadow DOM to render
    await sleep(5000);
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
    
    /**
     * getFeatureContent is a simple ui for the user to select from a list of features and extract the page content
     * @param input list containing all the feature information 
     */
    async getFeatureContent(input: InputValues): Promise<void> {
        const { list }: list.List = input as list.List;
        const featuresMap = new Map<string, feature>();

        for (const jsonString of list) {
            const json = JSON.parse(jsonString as string);
            const feature = { id: json["id"], name: json["name"], summary: json["summary"], category: json["category"], docs: json["resources"]["docs"], samples:json["resources"]["samples"] }
        
            featuresMap.set(`${json["id"]}`, feature)

        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });


        for (const feature of featuresMap) {
            console.log("-".repeat(40))
            console.log(feature[1])
            console.log("-".repeat(40))
        }

        try {
            while (true) {
                const answer = await rl.question('Please select a feature id to extract: ');

                if(featuresMap.has(answer)) {
                    const webContent = await extractFeatureContents(answer)

                    console.log("CONTENT", webContent)

                    const outputBuffer = []
                    const baseURL = "https://chromestatus.com/feature/"
                    outputBuffer.push({url:`${baseURL}${answer}`, content: webContent})

                    fs.writeFileSync(
                        "./test.json",
                        JSON.stringify(outputBuffer, null, 2)
                    );

                    break
                } else {
                    console.log("Id does not exist, please check input")
                }
            }
        } finally {
            rl.close();
        }
    },
})

export type FeatureKit = InstanceType<typeof FeatureKit>;
export default FeatureKit;