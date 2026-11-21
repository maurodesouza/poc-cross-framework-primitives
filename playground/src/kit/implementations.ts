import {
    IMPLEMENTATIONS,
    type Implementation,
} from "../../../conformance/src/implementations.ts";

/** The implementations the launcher starts when none is named: every framework, no baseline. */
export function defaultImplementations(
    all: readonly Implementation[],
): Implementation[] {
    return all.filter((implementation) => implementation.name !== "baseline");
}

/**
 * The implementations the playground shows: the ones `pnpm playground` started (a comma-separated
 * list of names, in `VITE_PLAYGROUND_IMPLEMENTATIONS`), or the default ones when it runs alone.
 * Unknown names are left out; the suite's order is kept.
 */
export function shownImplementations(
    all: readonly Implementation[],
    launched: string | undefined,
): Implementation[] {
    const names = (launched ?? "")
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");
    if (names.length === 0) {
        return defaultImplementations(all);
    }
    return all.filter((implementation) => names.includes(implementation.name));
}

/** The implementations of this playground run. */
export const SHOWN: readonly Implementation[] = shownImplementations(
    IMPLEMENTATIONS,
    import.meta.env.VITE_PLAYGROUND_IMPLEMENTATIONS,
);

/** Where an implementation's fixture is served, on the host the playground is opened from. */
export function originOf(implementation: Implementation): string {
    return `${window.location.protocol}//${window.location.hostname}:${implementation.port}`;
}
