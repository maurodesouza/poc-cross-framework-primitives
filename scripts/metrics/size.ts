import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
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

/**
 * The same measure for packages that ship framework source (`.svelte` files, Solid JSX): one
 * import, built with Vite in library mode and the framework's plugin, resolved from `resolveDir`
 * (a fixture that has Vite and the plugin), minified, then gzipped.
 */
export async function viteBundleSize(
    code: string,
    resolveDir: string,
    external: readonly string[],
    plugin: { name: string; factory: string; options?: unknown },
): Promise<SizeEntry> {
    const require = createRequire(join(resolveDir, "package.json"));
    const load = (name: string) =>
        import(pathToFileURL(require.resolve(name)).href);
    const vite = await load("vite");
    const framework = await load(plugin.name);
    const entry = "\0size-entry";
    const result = await vite.build({
        root: resolveDir,
        configFile: false,
        logLevel: "silent",
        plugins: [
            {
                name: "size-entry",
                enforce: "pre",
                resolveId: (id: string) =>
                    id.endsWith("size-entry") ? entry : null,
                load: (id: string) => (id === entry ? code : null),
            },
            framework[plugin.factory](plugin.options),
        ],
        build: {
            write: false,
            minify: true,
            lib: { entry: "size-entry", formats: ["es"], fileName: "entry" },
            rolldownOptions: {
                external: (id: string) =>
                    external.some(
                        (name) => id === name || id.startsWith(`${name}/`),
                    ),
            },
        },
    });
    const outputs = Array.isArray(result) ? result : [result];
    const chunk = outputs
        .flatMap(
            (output: { output: { type: string; code?: string }[] }) =>
                output.output,
        )
        .find((file: { type: string }) => file.type === "chunk") as
        | { code: string }
        | undefined;
    const bytes = Buffer.from(chunk?.code ?? "");
    return {
        entry: code,
        minified: bytes.byteLength,
        gzip: gzipSync(bytes).byteLength,
    };
}
