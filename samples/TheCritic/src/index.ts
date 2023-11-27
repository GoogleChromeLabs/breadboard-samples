/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//import '@anthropic-ai/sdk/shims/web'

import { register, run } from "./ui";
import { wrap } from "comlink";
import { Panel } from "./boards/the-panel";

register();

const w = new Worker(new URL("./worker.ts", import.meta.url), { type: "module"});

const panel = wrap<Panel>(w);

run(panel);





