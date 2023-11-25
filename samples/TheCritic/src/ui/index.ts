/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ACritic } from "./a-critic";
import { TheArticle } from "./the-article";
import { ThePanel } from "./the-panel";

export const register = () => {
  customElements.define("a-critic", ACritic);
  customElements.define("the-article", TheArticle);
  customElements.define("the-panel", ThePanel);
};

export const get = () => {
  return document.querySelector("#app");
};

