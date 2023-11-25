/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board, asRuntimeKit } from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";
import Critic from "./critic.ts";
import Starter from "@google-labs/llm-starter";
import ClaudeKit from "@paulkinlan/claude-breadboard-kit";

export type CriticResponse = {
  name: string;
  response: string;
};

export class Panel {
  #board: Board;
  #coreKit: Core;
  #critics: Record<string, { name: string, persona: string }> = {};
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
    const panelOutput = this.#board.output();
    const input = this.#board.input({ $id: `critic${id}-input` });
    const lambda = this.#board.lambda(Critic, { $id: `critic${id}-lambda`, name }).wire("input<-input", this.#inputText);
    const invoke = this.#coreKit.invoke({ board: lambda });
    invoke.wire("persona<-persona", input);
    invoke.wire("name<-name", input);
    invoke.wire("*->", panelOutput);

    // Store the critic state.
    this.#critics[`critic${id}-input`] = { name, persona };
  }

  async *critique(text: string): AsyncGenerator<CriticResponse> {
    const kits = [asRuntimeKit(Core), asRuntimeKit(Starter), asRuntimeKit(ClaudeKit)]
    for await (const stop of this.#board.run({ kits })) {
      if (stop.type === "input") {
        stop.inputs = { input: text, ...this.#critics[stop.node.id] };
      } else if (stop.type === "output") {
        yield stop.outputs as CriticResponse;
      }
    }
  }
}