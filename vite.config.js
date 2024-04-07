import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			vue: "@vue/compat",
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					compatConfig: {
						MODE: 2,
					},
				},
			},
		}),
		vueJsx(),
	],
	base: "",
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
				@import "@/assets/variables.scss";
				`,
			},
		},
	},
});
