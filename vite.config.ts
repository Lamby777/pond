import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src/client",
    plugins: [vue()],

    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },

    css: {
        preprocessorOptions: {
            scss: {
                api: "modern"
            }
        }
    }
});
