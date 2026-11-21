import angular from "@analogjs/vite-plugin-angular";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// the Angular compiler (TypeScript 6.0.3, this app's), zoneless: no zone.js anywhere
export default defineConfig({
    plugins: [angular({ tsconfig: "tsconfig.app.json" }), tailwindcss()],
    resolve: {
        dedupe: [
            "@angular/core",
            "@angular/common",
            "@angular/platform-browser",
        ],
    },
});
