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

/** An element to focus: an element, a ref to one, or `false` for none. */
export type FocusTarget =
    | HTMLElement
    | { current: HTMLElement | null }
    | false
    | null
    | undefined;

export function resolveFocusTarget(
    target: FocusTarget,
): HTMLElement | null | false {
    if (target === false) {
        return false;
    }
    if (target == null) {
        return null;
    }
    return target instanceof HTMLElement ? target : target.current;
}
