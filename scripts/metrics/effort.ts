import { execFileSync } from "node:child_process";

export interface Effort {
    commits: number;
    first: string | null;
    last: string | null;
}

/**
 * The commits that touched a path (agent runs: a proxy for effort, not human time), dated when
 * they were written (author date): a cherry-pick or rebase keeps it.
 */
export function effortOf(root: string, path: string): Effort {
    const log = execFileSync("git", ["log", "--format=%aI", "--", path], {
        cwd: root,
        encoding: "utf8",
    })
        .split("\n")
        .filter((line) => line !== "");
    return {
        commits: log.length,
        first: log.at(-1) ?? null,
        last: log[0] ?? null,
    };
}
