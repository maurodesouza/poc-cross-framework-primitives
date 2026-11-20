import { getTabbables } from "./tabbable.ts";

/**
 * Keeps Tab and Shift+Tab inside `container` (spec/dialog.md, "Focus"), wrapping at its ends, and
 * pulls focus back when it escapes (to an element outside `container` and outside `allow()`, the
 * child layers). Returns the cleanup.
 */
export function trapFocus(
    container: HTMLElement,
    allow: () => readonly (Element | null | undefined)[] = () => [],
): () => void {
    const doc = container.ownerDocument;
    const inside = (target: EventTarget | null) =>
        target instanceof Node &&
        (container.contains(target) ||
            allow().some((element) => element?.contains(target) === true));

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab" || event.defaultPrevented) {
            return;
        }
        // a child layer handles its own Tab
        if (!container.contains(doc.activeElement)) {
            return;
        }
        const tabbables = getTabbables(container);
        if (tabbables.length === 0) {
            event.preventDefault();
            container.focus();
            return;
        }
        const first = tabbables[0] as HTMLElement;
        const last = tabbables.at(-1) as HTMLElement;
        const active = doc.activeElement;
        if (event.shiftKey && (active === first || active === container)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };
    const onFocusIn = (event: FocusEvent) => {
        if (!inside(event.target)) {
            (getTabbables(container)[0] ?? container).focus();
        }
    };
    doc.addEventListener("keydown", onKeyDown);
    doc.addEventListener("focusin", onFocusIn);
    return () => {
        doc.removeEventListener("keydown", onKeyDown);
        doc.removeEventListener("focusin", onFocusIn);
    };
}

/** Focuses `initial`, else the first tabbable element of `container`, else `container`. */
export function focusInitial(
    container: HTMLElement,
    initial?: HTMLElement | null,
): void {
    (initial ?? getTabbables(container)[0] ?? container).focus({
        preventScroll: true,
    });
}
