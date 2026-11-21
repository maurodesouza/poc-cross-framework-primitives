import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

// Library mode: the Solid compiler (through its Vite plugin) turns the JSX into DOM code; Solid
// and @poc/dom stay external (README.md, "Build").
export default defineConfig({
    plugins: [solid()],
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
            fileName: "index",
        },
        minify: false,
        rolldownOptions: {
            external: [/^solid-js/, /^@solidjs\//, "@poc/dom"],
        },
    },
});
