import { gzipSync } from "node:zlib";
import { build } from "esbuild";

export interface SizeEntry {
    /** What is measured: `import { Dialog } from "@poc/react"`. */
    entry: string;
    minified: number;
    gzip: number;
}

/**
 * The size of one import, bundled alone with esbuild (minified, then gzipped), the framework
 * external. `resolveDir` is a workspace whose node_modules resolves the package.
 */
export async function bundleSize(
    code: string,
    resolveDir: string,
    external: readonly string[],
): Promise<SizeEntry> {
    const result = await build({
        stdin: { contents: code, resolveDir, loader: "ts" },
        bundle: true,
        minify: true,
        format: "esm",
        platform: "browser",
        write: false,
        external: [...external],
        logLevel: "silent",
        jsx: "automatic",
    });
    const output = result.outputFiles[0]?.contents ?? new Uint8Array();
    return {
        entry: code,
        minified: output.byteLength,
        gzip: gzipSync(output).byteLength,
    };
}
