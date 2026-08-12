import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
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
		clearScreen: false,
		base: "",
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/assets/styles/variables.scss";`,
				},
			},
		},
		build: {
			minify: false,
		},
		server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
	};
});
