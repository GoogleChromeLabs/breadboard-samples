
import '@anthropic-ai/sdk/shims/web'
import { Panel } from './boards/the-panel';
import { expose } from "comlink";
import "./lib/comlink-async.ts";

expose(new Panel);
