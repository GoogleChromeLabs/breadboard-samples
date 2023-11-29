import { defineConfig } from "vite";
import path from "path";
import watchAndRun from "vite-plugin-watch-and-run";
import fullReload from "vite-plugin-full-reload";

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
	plugins: [watchAndRun([
        {
          watch: path.resolve("src/boards/**/*.ts"),
          run: "npm run generate:graphs",
        },
      ]),
      fullReload(["public/*.json"])],
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
