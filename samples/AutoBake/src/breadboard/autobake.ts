import { FeatureKit } from "./featurekit"
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";
import { StringKit, ConfigKit } from "@exadev/breadboard-kits";
import { Board } from "@google-labs/breadboard"
import fs from "fs"
import * as url from 'url';
import generateAndWriteCombinedMarkdown from "@exadev/breadboard-kits/util/files/generateAndWriteCombinedMarkdown";

const board = new Board({ title: "AutoBake" });
const featureKit = board.addKit(FeatureKit);
const claudeKit = board.addKit(ClaudeKit);
const stringKit = board.addKit(StringKit);
const config = board.addKit(ConfigKit);


const getFeatureContent = featureKit.getFeatureResources({ $id: "featureResources" });
const features = featureKit.chromeStatusApiFeatures({$id: "chromeApiFeatures"});

const serverUrl = "https://api.anthropic.com/v1/complete";
const claudeParams = {
    model: "claude-2",
    url: `${serverUrl}`,
};

const claudeCompletion = claudeKit.generateCompletion({
    $id: "claudeAPI",
    ...claudeParams,
});

const prompt = [
    "Based on these documents, give me a script that can be used to teach a junior developer about the discussed topic in the document, output in markdown format?:",
    "{{featureResources}}",
].join("/n");
const instructionTemplate = stringKit.template({
    $id: "claudePromptConstructor",
    template: prompt,
});

const claudeApiKey = config.readEnvVar({
    $id: "getClaudeAPIKey",
    key: "CLAUDE_API_KEY"
});

features.wire("features->list", getFeatureContent);

getFeatureContent.wire("featureResources->featureResources", instructionTemplate);
claudeApiKey.wire("CLAUDE_API_KEY", claudeCompletion);
instructionTemplate.wire("string->text", claudeCompletion);
claudeCompletion.wire("completion->", board.output({$id:"claudeOutput"}));

const result = await board.runOnce({});

generateAndWriteCombinedMarkdown({
    board,
    filename: "AutobakeMermaid",
    dir: url.fileURLToPath(new URL('.', import.meta.url))
});

fs.writeFileSync(
    "./featureScript.md",
    result.completion!.toString()
);