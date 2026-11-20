import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    format: "esm",
    dts: false,
    platform: "browser",
    external: ["react", "react-dom", "react/jsx-runtime", "@poc/dom"],
});
