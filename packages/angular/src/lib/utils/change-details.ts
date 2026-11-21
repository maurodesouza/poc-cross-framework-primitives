import { ElementRef } from "@angular/core";

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
    | "trigger-hover"
    | "trigger-focus"
    | "keyboard"
    | "track-press"
    | "drag"
    | "none";

export interface ChangeDetails {
    reason: ChangeReason;
}

/** What `(openChangeDetails)` emits: the new open state and why it changed. */
export interface OpenChangeEvent {
    open: boolean;
    details: ChangeDetails;
}

/** What `(valueChangeDetails)` emits: the new value and why it changed. */
export interface ValueChangeEvent<T> {
    value: T;
    details: ChangeDetails;
}

/**
 * An element to focus: an element (a template reference variable on it), an `ElementRef`, a
 * getter read when the focus moves, or `false` for none.
 */
export type FocusTarget =
    | HTMLElement
    | ElementRef<HTMLElement>
    | (() => HTMLElement | null)
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
    if (target instanceof ElementRef) {
        return target.nativeElement;
    }
    return typeof target === "function" ? target() : target;
}
