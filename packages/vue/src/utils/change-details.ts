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
 * An element to focus: an element, a component instance (its root element), a template ref
 * holding either, a getter of any of them, or `false` for none.
 *
 * A template auto-unwraps a ref, so `:initial-focus="cancel"` passes its value at render time,
 * before the element exists when it is inside the popup. A getter (`:initial-focus="() =>
 * cancel"`) is read when the focus moves, after the content mounted.
 */
export type FocusTarget =
    | HTMLElement
    | object
    | (() => unknown)
    | false
    | null
    | undefined;

export function resolveFocusTarget(
    target: FocusTarget,
): HTMLElement | null | false {
    if (typeof target === "function") {
        return resolveFocusTarget(target() as FocusTarget);
    }
    if (target === false) {
        return false;
    }
    if (target == null) {
        return null;
    }
    const direct = toElement(target);
    if (direct !== null) {
        return direct;
    }
    return "value" in target
        ? toElement((target as { value: unknown }).value)
        : null;
}

/** The element behind a template ref: the element itself, or a component's root element. */
export function toElement(value: unknown): HTMLElement | null {
    if (value === null || typeof value !== "object") {
        return null;
    }
    if ((value as { nodeType?: unknown }).nodeType === 1) {
        return value as HTMLElement;
    }
    const root = (value as { $el?: unknown }).$el;
    return root !== null &&
        typeof root === "object" &&
        (root as { nodeType?: unknown }).nodeType === 1
        ? (root as HTMLElement)
        : null;
}
