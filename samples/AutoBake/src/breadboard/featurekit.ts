/* eslint-disable no-constant-condition */
import { KitBuilder } from "@google-labs/breadboard/kits";
import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { list } from "@exadev/breadboard-kits/types";
import * as readline from 'readline/promises';
import fs from "fs";
import * as puppeteer from "puppeteer";
import claude from "@anthropic-ai/tokenizer/claude.json" assert { type: "json" };
import chromeStatusApiFeatures from "./chromeStatusApiFeatures";
import { chromeStatusFeaturesV2 } from "./chromeStatusFeaturesV2";
import { chromeVersions } from "./chromeVersions";
import { Tiktoken, TiktokenBPE } from "js-tiktoken";

type pageContents = {
    contents: NodeValue
};

type feature = {
    id: NodeValue,
    name: NodeValue,
    summary: NodeValue,
    category: NodeValue,
    docs: NodeValue[],
    samples: NodeValue[]
};

type featureDocuments = NodeValue

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Instansiates a Tiktoken object
 * @returns Tiktoken object
 */
export function getTokenizer(): Tiktoken {
    const tiktokenBPE: TiktokenBPE = {
        pat_str: claude.pat_str,
        special_tokens: claude.special_tokens,
        bpe_ranks: claude.bpe_ranks,
    };
    return new Tiktoken(tiktokenBPE);
}

/**
 * countTokens is a helper function which calculates the number of tokens when a string is encoded
 * this is used so we know if we need to trim some website content when forming the prompt for a feature
 * @param text string that will form part of the claude prompt
 * @returns the number of tokens when the string is encoded
 */
export function countTokens(text: string): number {
    const tokenizer = getTokenizer();
    const encoded = tokenizer.encode(text.normalize("NFKC"));
    return encoded.length;
}

/**
 * extractContents extracts all contents of a web url. This will be used as part of a prompt for claude API
 * there is no need for the content to be human-readable as LLM can handle it, so just extract the whole HTML
 * @param url the url of the website to extract
 * @returns pageContents the html content of the web url
 */
export async function extractContents(url: string): Promise<pageContents> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], });
    const page = await browser.newPage();

    console.log("Extracting Feature Resources: ", url);

    await page.goto(url, { waitUntil: 'load' });
    // sleep because some page elements might not immediately render
    await sleep(5000);
    const element = await page.evaluateHandle(`document.querySelector("body")`);

    let contents = await page.evaluate(el => el.textContent, element);
    contents = contents.replace(/\n|\r/g, "");

    await browser.close();

    return Promise.resolve({ contents });
}

/**
 * extractFeatureResource extracts content from a "https://chromestatus.com/feature/$id" url 
 * chromestatus pages uses shadowRoots so we have to query it differently to other web urls
 * @param id the id of the feature to extract
 * @returns  the content of the web page for the given feature
 */
async function extractFeatureResource(id: string): Promise<pageContents> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], });
    const page = await browser.newPage();

    const baseURL = "https://chromestatus.com/feature/"
    const featureURL = `${baseURL}${id}`;
    console.log("Extracting Feature Content: ", featureURL);

    await page.goto(featureURL, { waitUntil: 'load' });
    // sleep to wait for page to render
    await sleep(5000);
    const element = await page.evaluateHandle(`document.querySelector("body > chromedash-app").shadowRoot.querySelector("#content-component-wrapper > chromedash-feature-page").shadowRoot.querySelector("sl-details")`);

    let contents = await page.evaluate(el => el.textContent, element);

    contents = contents.replace(/\n|\r/g, "");

    await browser.close();

    return Promise.resolve({ contents });
}

export const FeatureKit = new KitBuilder({
    url: "npm@exadev/breadboard-kits/featureKit"
}).build({
    async versions(): Promise<OutputValues> {
        return chromeVersions();
    },
    /**
     * chromeStatusApiFeatures retrieves the chrome Api features
     * @returns json containing chrome api features
     */
    async chromeStatusApiFeatures(): Promise<OutputValues> {
        return { features: await chromeStatusApiFeatures() };
    },
        /**
     * chromeStatusFeaturesV2 retrieves the chrome Api features V2
     * @returns json containing chrome api features V2
     */
    async chromeStatusFeaturesV2(): Promise<OutputValues> {
        return { features: await chromeStatusFeaturesV2() };
    },
    /**
     * getFeatureResources is a simple ui for the user to select from a list of features and extract the page content
     * @param input list containing all the feature information 
     */
    async getFeatureResources(input: InputValues): Promise<OutputValues> {
        const { list }: list.List = input as list.List;
        const featuresMap = new Map<string, feature>();

        for (const json of list["features"]) {
            const feature = { id: json["id"], name: json["name"], summary: json["summary"], category: json["category"], docs: json["resources"]["docs"], samples: json["resources"]["samples"] };

            featuresMap.set(`${json["id"]}`, feature);
        }
        const userInput = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        for (const feature of featuresMap) {
            console.log("-".repeat(40));
            console.log(feature[1]);
            console.log("-".repeat(40));
        }

        const featureResources: featureDocuments[] = [];
        try {
            while (true) {
                const answer = await userInput.question('Please select a feature id to extract: ');
                if (featuresMap.has(answer)) {
                    const webContent = await extractFeatureResource(answer);
                    featureResources.push(webContent["contents"]);

                    const feature = featuresMap.get(answer);
                    const featureDocs = feature!["docs"];
                    const featureSamples = feature!["samples"];

                    // extract documentation contents
                    for (const doc of featureDocs) {
                        const webContent = await extractContents(doc as string)
                        featureResources.push(webContent["contents"]);
                    }
                    // extract samples content
                    for (const sample of featureSamples) {
                        const webContent = await extractContents(sample as string)
                        featureResources.push(webContent["contents"]);
                    }

                    // Claude has token limit, keep trimming each document until we are below the token limit
                    // set to 99,000 as extra tokens will be added when constructing hte prompt
                    // maybe trim the larger documents with a different coefficient? 20% of a large document might lose
                    // a lot of useful information
                    while (true) {
                        let tokenCount = 0
                        for (let i = 0; i < featureResources.length; i++) {
                            tokenCount += countTokens(featureResources[i] as string);
                        }

                        if (tokenCount >= 99000) {
                            for (let i = 0; i < featureResources.length; i++) {
                                // only keep 80% of the current content 
                                // there's probably a better way to do that, but it's difficult to know the structure of the HTML because it all comes from different sources
                                featureResources[i] = (featureResources[i] as string).substring(0, (featureResources[i] as string).length * 0.8);
                            }
                        } else {
                            break;
                        }
                    }
                    const outputBuffer = [];
                    const baseURL = "https://chromestatus.com/feature/"
                    outputBuffer.push({ url: `${baseURL}${answer}`, content: featureResources });
                    // write all extracted content to file
                    fs.writeFileSync(
                        "./featureContent.json",
                        JSON.stringify(outputBuffer, null, 2)
                    );
                    break
                } else {
                    console.log("Feature Id does not exist, please check input")
                }
            }
        } finally {
            userInput.close();
        }
        return Promise.resolve({ featureResources });
    },
})

export type FeatureKit = InstanceType<typeof FeatureKit>;
export default FeatureKit;