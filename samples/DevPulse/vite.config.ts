import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		VitePWA({
			registerType: "autoUpdate",
			strategies: "injectManifest",
			injectRegister: "auto",
			devOptions: {
				enabled: true,
			},
			srcDir: "src",
			filename: "sw/worker.ts",
			workbox: {
				clientsClaim: true,
				skipWaiting: true,
			},
		}),
	],
	server: {
		port: 5173,
		strictPort: true,
		proxy: {
			"/anthropic": {
				target: "https://api.anthropic.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/anthropic/, ""),
			},
			"/claude": {
				target: "https://api.anthropic.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/claude/, "/v1/complete"),
			},
		},
	},
});
