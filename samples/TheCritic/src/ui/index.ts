/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Remote } from "comlink";
import { Panel } from "../boards/the-panel";
import { ACritic } from "./a-critic";
import { TheArticle } from "./the-article";
import { ThePanel } from "./the-panel";

import "../lib/comlink-async.ts";

export const register = () => {
	customElements.define("a-critic", ACritic);
	customElements.define("the-article", TheArticle);
	customElements.define("the-panel", ThePanel);
};

export const get = () => {
	return document.querySelector("#app");
};

// TODO: add a UI Controller that will handle UI events and udpate the board.

export const run = async () => {
	const app = get();
	if (app == undefined) return;

	const articleElement = app.getElementsByTagName("the-article")[0] as TheArticle;

	if (articleElement) {

		articleElement.addEventListener("critique", (async (e: CustomEvent) => {
			const criticsElements = app.getElementsByTagName("a-critic");
			const article = e.detail.text;

			const panel = new Panel();

			for (let i = 0; i < criticsElements.length; i++) {
				const critic = criticsElements[i] as ACritic;
				const { name, persona } = critic;
				if (name == null || persona == null) {
					continue;
				}
				const criticData = await panel.addCritic(name, persona);
				critic.id = criticData.id;
			}

			const ittr = await panel.critique(article);

			for await (const response of ittr) {
				console.log(`## ${response.name}\n`)
				console.log(`${response.response}\n`)

				const id = response.id;
				const el = document.querySelector(`a-critic[id="${id}"]`) as ACritic;
				if (el) {
					const responseEl = document.createElement("div");
					responseEl.innerHTML = response.response;
					responseEl.slot = "response";
					el.appendChild(responseEl)
				}
			}

		}) as (e: Event) => Promise<void>);
	}
}
