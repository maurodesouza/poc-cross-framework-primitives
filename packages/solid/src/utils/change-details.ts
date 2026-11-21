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
    | "input-press"
    | "input-clear"
    | "clear-press"
    | "chip-remove-press"
    | "trigger-hover"
    | "trigger-focus"
    | "keyboard"
    | "track-press"
    | "drag"
    | "none";

export interface ChangeDetails {
    reason: ChangeReason;
}

/**
 * An element to focus: an element, a getter of one (Solid refs are callbacks, so the element only
 * exists once the part rendered: `initialFocus={() => cancel}`), or `false` for none.
 */
export type FocusTarget =
    | HTMLElement
    | (() => HTMLElement | null | undefined)
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
    return target instanceof HTMLElement ? target : (target() ?? null);
}
