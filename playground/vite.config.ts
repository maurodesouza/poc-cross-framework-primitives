import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// `pnpm playground` (scripts/playground.ts) serves it on 5300, beside the fixtures' suite ports
export default defineConfig({
    plugins: [tailwindcss()],
    server: { port: 5300, strictPort: true },
    preview: { port: 5300, strictPort: true },
});
