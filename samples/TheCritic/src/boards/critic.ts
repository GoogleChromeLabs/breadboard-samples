/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board } from "@google-labs/breadboard";
import { Starter } from "@google-labs/llm-starter";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";

const board = new Board({
  title: "The Critic",
  description: "Test Breadboard Kit",
  version: "0.0.1",
});

const starterKit = board.addKit(Starter);
const claudeKit = board.addKit(ClaudeKit);

const criticOutput = board.output();

const inputCritic = board.input({
  $id: "critic-name",
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Critic Name",
        description: "The name of the Critic"
      },
      input: {
        type: "string",
        title: "inputToCritique",
        description: "The input that is being critiqued",
      },
      persona: {
        type: "string",
        title: "Critic Persona",
        description: "The Persona of the Critic",
      }
    }
  }
});

const secret = starterKit.secrets(["CLAUDE_API_KEY"]);
const criticPrompt = starterKit.promptTemplate(`
Your name is {{name}} and you are a {{persona}}.

You will create a critique of the following input:

{{input}}

Critique:
`);

const claudeCompletion = claudeKit.generateCompletion({ model: "claude-2.1", baseURL: location.origin});

inputCritic.wire("persona->persona", criticPrompt);
inputCritic.wire("input->input", criticPrompt);
inputCritic.wire("name->name", criticPrompt);

criticPrompt.wire("prompt->text", claudeCompletion);
secret.wire("CLAUDE_API_KEY->CLAUDE_API_KEY", claudeCompletion);

claudeCompletion.wire("completion->response", criticOutput);
inputCritic.wire("name->name", criticOutput);

export default board;
