import type { Snippet } from "svelte";
import type { SpreadProps } from "./merge-props.ts";

/** What a part's `child` snippet receives: the props to spread on your element, and the state. */
export interface ChildProps<State> {
    props: SpreadProps;
    state: State;
}

/** The props every part takes besides its own (spec/README.md, API mapping: Svelte). */
export interface PartProps<State> {
    /** Replaces the part's element (never `asChild`): spread `props` on your own element. */
    child?: Snippet<[ChildProps<State>]>;
    children?: Snippet;
    class?: unknown;
    style?: string;
    [key: string]: unknown;
}
