import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export const buildCustomAllowList = (value?: string) => {
	if (!value) return {};
	return { fs: { allow: [value] } };
};
export default defineConfig({
	build: {
		lib: {
			entry: {
				worker: "src/worker.ts",
				sample: "./index.html",
			},
			name: "Breadboard Web Runtime",
			formats: ["es"],
		},
		target: "esnext",
	},
	worker: {
		plugins: [wasm(), topLevelAwait()]
	},
	plugins: [wasm(), topLevelAwait()],
	server: {
		port: 5173,
		strictPort: true,
		proxy: {
			"/v1/complete": {
				target: "https://api.anthropic.com",
				changeOrigin: true
			},
		},
	},
});
