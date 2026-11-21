// `pnpm playground [--framework <name>[,<name>]] [--baseline]`: every fixture's dev server (Vite,
// with HMR) on its conformance suite port, then the playground app on 5300
// (playground/, README.md "Playground"). Each server's output is prefixed with its name; Ctrl+C
// (or SIGTERM) stops every child's whole process tree, so no port stays in use.
import { type ChildProcess, spawn } from "node:child_process";
import { join } from "node:path";
import {
    IMPLEMENTATIONS,
    type Implementation,
} from "../conformance/src/implementations.ts";

const root = join(import.meta.dirname, "..");

/** The playground's own port (playground/vite.config.ts). */
export const PLAYGROUND_PORT = 5300;

/** How long a child gets to stop on SIGTERM before it is killed. */
const KILL_TIMEOUT = 5000;

export interface PlaygroundOptions {
    /** The framework names given with `--framework`; empty for every framework. */
    frameworks: string[];
    baseline: boolean;
}

/** Reads `--framework a,b` (repeatable, or `--framework=a,b`) and `--baseline`. */
export function parseArgs(argv: readonly string[]): PlaygroundOptions {
    const options: PlaygroundOptions = { frameworks: [], baseline: false };
    const add = (list: string) => {
        options.frameworks.push(
            ...list
                .split(",")
                .map((name) => name.trim())
                .filter((name) => name !== ""),
        );
    };
    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index] ?? "";
        if (arg === "--baseline") {
            options.baseline = true;
        } else if (arg === "--framework") {
            const next = argv[index + 1];
            if (next === undefined || next.startsWith("--")) {
                throw new Error(
                    "--framework needs a name (or a list: vue,solid)",
                );
            }
            add(next);
            index++;
        } else if (arg.startsWith("--framework=")) {
            add(arg.slice("--framework=".length));
        } else if (arg !== "--") {
            throw new Error(`unknown argument: ${arg}`);
        }
    }
    return options;
}

/**
 * The implementations to start, in the suite's order: the named frameworks (every framework when
 * none is named), plus the baseline with `--baseline`. An unknown name is an error.
 */
export function selectImplementations(
    all: readonly Implementation[],
    options: PlaygroundOptions,
): Implementation[] {
    const frameworks = all.filter(
        (implementation) => implementation.name !== "baseline",
    );
    const known = frameworks.map((implementation) => implementation.name);
    const unknown = options.frameworks.filter((name) => !known.includes(name));
    if (unknown.length > 0) {
        throw new Error(
            `unknown framework: ${unknown.join(", ")} (one of ${known.join(", ")}; the baseline is --baseline)`,
        );
    }
    return all.filter((implementation) =>
        implementation.name === "baseline"
            ? options.baseline
            : options.frameworks.length === 0 ||
              options.frameworks.includes(implementation.name),
    );
}

/** One server to start: its name (the output prefix), its pnpm arguments and its environment. */
export interface Server {
    name: string;
    args: string[];
    env: Record<string, string>;
}

/** The fixtures' dev servers on their suite ports, then the playground told which ones run. */
export function serversOf(
    implementations: readonly Implementation[],
): Server[] {
    const fixtures = implementations.map((implementation) => ({
        name: implementation.name,
        args: [
            "--filter",
            implementation.fixture,
            "dev",
            "--port",
            String(implementation.port),
            "--strictPort",
        ],
        env: {},
    }));
    return [
        ...fixtures,
        {
            name: "playground",
            args: [
                "--filter",
                "playground",
                "dev",
                "--port",
                String(PLAYGROUND_PORT),
                "--strictPort",
            ],
            env: {
                VITE_PLAYGROUND_IMPLEMENTATIONS: implementations
                    .map((implementation) => implementation.name)
                    .join(","),
            },
        },
    ];
}

/**
 * Prefixes every complete line of a chunk with `[name] `, keeping an incomplete last line for the
 * next chunk. Returns the prefixed text and what is left over.
 */
export function prefixLines(
    name: string,
    pending: string,
    chunk: string,
): { text: string; rest: string } {
    const lines = (pending + chunk).split(/\r?\n/);
    const rest = lines.pop() ?? "";
    return {
        text: lines.map((line) => `[${name}] ${line}\n`).join(""),
        rest,
    };
}

function pipe(
    name: string,
    stream: NodeJS.ReadableStream,
    out: NodeJS.WriteStream,
) {
    let pending = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
        const { text, rest } = prefixLines(name.padEnd(10), pending, chunk);
        pending = rest;
        out.write(text);
    });
    stream.on("end", () => {
        if (pending !== "") {
            out.write(`[${name.padEnd(10)}] ${pending}\n`);
        }
    });
}

/** Sends a signal to a child's whole process group (it was spawned detached, as its leader). */
function signalTree(child: ChildProcess, signal: NodeJS.Signals): void {
    if (child.pid === undefined || child.exitCode !== null) {
        return;
    }
    try {
        process.kill(-child.pid, signal);
    } catch {
        // the group is already gone
    }
}

function main(): void {
    let implementations: Implementation[];
    try {
        implementations = selectImplementations(
            IMPLEMENTATIONS,
            parseArgs(process.argv.slice(2)),
        );
    } catch (error) {
        console.error(`playground: ${(error as Error).message}`);
        process.exit(1);
    }

    const children = new Map<string, ChildProcess>();
    let stopping = false;

    function stop(code: number): void {
        if (stopping) {
            return;
        }
        stopping = true;
        console.log("\nplayground: stopping every server…");
        for (const child of children.values()) {
            signalTree(child, "SIGTERM");
        }
        const timer = setTimeout(() => {
            for (const child of children.values()) {
                signalTree(child, "SIGKILL");
            }
        }, KILL_TIMEOUT);
        const exitWhenDone = () => {
            if (
                [...children.values()].every(
                    (child) =>
                        child.exitCode !== null || child.signalCode !== null,
                )
            ) {
                clearTimeout(timer);
                process.exit(code);
            }
        };
        for (const child of children.values()) {
            child.once("exit", exitWhenDone);
        }
        exitWhenDone();
    }

    process.on("SIGINT", () => stop(0));
    process.on("SIGTERM", () => stop(0));
    process.on("SIGHUP", () => stop(0));
    // the launcher exiting any other way (an error) still takes its servers with it
    process.on("exit", () => {
        for (const child of children.values()) {
            signalTree(child, "SIGTERM");
        }
    });

    for (const server of serversOf(implementations)) {
        // detached: each server leads its own process group, so the whole tree (pnpm, vite,
        // esbuild) is signalled at once; Ctrl+C reaches only this launcher, which stops them
        const child = spawn("pnpm", server.args, {
            cwd: root,
            env: { ...process.env, ...server.env, FORCE_COLOR: "1" },
            stdio: ["ignore", "pipe", "pipe"],
            detached: true,
        });
        children.set(server.name, child);
        if (child.stdout !== null) {
            pipe(server.name, child.stdout, process.stdout);
        }
        if (child.stderr !== null) {
            pipe(server.name, child.stderr, process.stderr);
        }
        child.on("error", (error) => {
            console.error(
                `playground: ${server.name} failed to start: ${error.message}`,
            );
            stop(1);
        });
        child.on("exit", (code, signal) => {
            if (stopping) {
                return;
            }
            console.error(
                `playground: ${server.name} stopped (${signal ?? `exit ${code}`}); the others keep running`,
            );
            if (server.name === "playground") {
                stop(1);
            }
        });
    }

    const fixtures = implementations
        .map(
            (implementation) =>
                `${implementation.name} :${implementation.port}`,
        )
        .join(", ");
    console.log(
        `playground: http://localhost:${PLAYGROUND_PORT} (fixtures: ${fixtures}). Ctrl+C stops everything.`,
    );
}

// only when run, not when a test imports it
if (import.meta.main) {
    main();
}
