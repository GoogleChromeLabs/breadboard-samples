/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board, LogProbe, asRuntimeKit } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import Critic from "./critic.ts";
import Starter from "@google-labs/llm-starter";
import ClaudeKit from "@paulkinlan/claude-breadboard-kit";

export type CriticResponse = {
  id: string,
  name: string;
  response: string;
};

export class Panel {
  #board: Board;
  #coreKit: Core;
  #critics: Record<string, { id: string, name: string, persona: string }> = {};
  #inputText;

  get board() {
    return this.#board;
  }

  constructor() {
    this.#board = new Board({
      title: "The Panel",
      description: "A Panel of Critics",
      version: "0.0.1",
    });

    this.#coreKit = this.#board.addKit(Core);
    this.#inputText = this.#board.input({ $id: "input-text" });

  }

  addCritic(name: string, persona: string) {
    // Set up the board.
    const id = Object.keys(this.#critics).length + 1;
	const idStr = `critic${id}`;
    const panelOutput = this.#board.output();

    const input = this.#board.input({ $id: `${idStr}-input`})
    const lambda = this.#board.lambda(Critic, { $id: `${idStr}-lambda`, name, persona}).wire("article<-article", this.#inputText);
    const invoke = this.#coreKit.invoke({ board: lambda });
	invoke.wire("id<-id", input);
    invoke.wire("persona<-persona", input);
    invoke.wire("name<-name", input);
    invoke.wire("*->", panelOutput);

    // Store the critic state.
    this.#critics[`${idStr}-input`] = { id: idStr, name, persona };

	return {id: `${idStr}`, name, persona};
  }

  async *critique(text: string): AsyncGenerator<CriticResponse> {
    const kits = [asRuntimeKit(Core), asRuntimeKit(Starter), asRuntimeKit(ClaudeKit)]
    for await (const stop of this.#board.run({ kits, probe: new LogProbe() })) {
      if (stop.type === "input") {
        stop.inputs = { article: text, ...this.#critics[stop.node.id] };
      } else if (stop.type === "output") {
        yield stop.outputs as CriticResponse;
      }
    }
  }
}

// testing so we can preview the board.
const p = new Panel()
p.addCritic("Paul", "The Critic");

export default p.board;
