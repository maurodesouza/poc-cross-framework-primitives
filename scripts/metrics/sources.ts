import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { countLoc } from "./loc.ts";

export const COMPONENTS = [
    "dialog",
    "popover",
    "menu",
    "combobox",
    "tabs",
    "calendar",
    "date-picker",
] as const;

/** The extras (Epic F: React and Vue; Epic G: the others) and Field (Epic H), one folder each. */
export const EXTRA_COMPONENTS = [
    "select",
    "tooltip",
    "checkbox",
    "checkbox-group",
    "slider",
    "field",
] as const;
export type Component =
    | (typeof COMPONENTS)[number]
    | (typeof EXTRA_COMPONENTS)[number];

const SOURCE = /\.(ts|tsx|vue|svelte)$/;

export function sourceFiles(dir: string): string[] {
    if (!existsSync(dir)) {
        return [];
    }
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
            return sourceFiles(path);
        }
        return SOURCE.test(name) ? [path] : [];
    });
}

export function locOf(files: readonly string[]): number {
    return files.reduce(
        (total, file) => total + countLoc(readFileSync(file, "utf8")),
        0,
    );
}

/** The `@poc/dom` module files that export each name, read from its entry. */
export function domExports(root: string): Map<string, string> {
    const entry = readFileSync(join(root, "packages/dom/src/index.ts"), "utf8");
    const names = new Map<string, string>();
    for (const match of entry.matchAll(
        /export\s*\{([^}]*)\}\s*from\s*"\.\/([^"]+)"/g,
    )) {
        const file = join(root, "packages/dom/src", match[2] ?? "");
        for (const raw of (match[1] ?? "").split(",")) {
            const name = raw.replace(/\btype\b/, "").trim();
            if (name !== "") {
                names.set(name, file);
            }
        }
    }
    return names;
}

/** The names a set of files imports from `@poc/dom`. */
export function domImports(files: readonly string[]): Set<string> {
    const names = new Set<string>();
    for (const file of files) {
        const text = readFileSync(file, "utf8");
        for (const match of text.matchAll(
            /import\s*\{([^}]*)\}\s*from\s*"@poc\/dom"/g,
        )) {
            for (const raw of (match[1] ?? "").split(",")) {
                const name = raw.replace(/\btype\b/, "").trim();
                if (name !== "") {
                    names.add(name);
                }
            }
        }
    }
    return names;
}

/** The files a set of files imports through relative paths, transitively (inside `root`). */
export function importClosure(files: readonly string[]): string[] {
    const seen = new Set<string>();
    const queue = [...files];
    while (queue.length > 0) {
        const file = queue.pop() as string;
        if (seen.has(file) || !existsSync(file)) {
            continue;
        }
        seen.add(file);
        const text = readFileSync(file, "utf8");
        for (const match of text.matchAll(/from\s*"(\.{1,2}\/[^"]+)"/g)) {
            queue.push(join(file, "..", match[1] ?? ""));
        }
    }
    return [...seen];
}

export interface ComponentLoc {
    component: Component;
    /** The component's own files in the framework package. */
    framework: number;
    /** The `@poc/dom` modules it uses (directly, or through the package's shared hooks). */
    dom: number;
    domModules: string[];
}

/**
 * Lines per component: its folder in the framework package, and the `@poc/dom` modules that
 * folder imports, directly or through the package's shared files it imports.
 */
export function componentLoc(
    root: string,
    framework: string,
    componentsDir = "components",
    measured: readonly Component[] = COMPONENTS,
): { components: ComponentLoc[]; shared: number } {
    const pkg = join(root, "packages", framework, "src");
    const sharedFiles = [
        "hooks",
        "utils",
        "composables",
        "components/shared",
        "lib/utils",
        "lib/inject",
    ].flatMap((dir) => sourceFiles(join(pkg, dir)));
    const exportsMap = domExports(root);
    const components = measured.map((component) => {
        const files = sourceFiles(join(pkg, componentsDir, component));
        const used = domImports(
            importClosure(files).filter((file) => file.startsWith(pkg)),
        );
        const domFiles = [
            ...new Set(
                [...used]
                    .map((name) => exportsMap.get(name))
                    .filter((file): file is string => !!file),
            ),
        ];
        return {
            component,
            framework: locOf(files),
            dom: locOf(domFiles),
            domModules: domFiles
                .map((file) => relative(join(root, "packages/dom/src"), file))
                .sort(),
        };
    });
    return { components, shared: locOf(sharedFiles) };
}
