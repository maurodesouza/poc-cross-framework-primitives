/** Why a value or an open state changed (spec/README.md, "Change details"). */
export type ChangeReason =
    | "trigger-press"
    | "close-press"
    | "escape-key"
    | "outside-press"
    | "focus-out"
    | "item-press"
    | "list-navigation"
    | "input-change"
    | "none";

export interface ChangeDetails {
    reason: ChangeReason;
}

/** An element to focus: an element, a getter of one, or `false` for none. */
export type FocusTarget =
    | HTMLElement
    | (() => HTMLElement | null | undefined)
    | false
    | null
    | undefined;

export function resolveFocusTarget(
    target: FocusTarget,
): HTMLElement | null | false {
    if (typeof target === "function") {
        return target() ?? null;
    }
    if (target === false) {
        return false;
    }
    return target ?? null;
}
