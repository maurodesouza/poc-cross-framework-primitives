import { afterNextRender, DestroyRef, inject } from "@angular/core";
import { VISUALLY_HIDDEN_INPUT_STYLE } from "@poc/dom";

/**
 * A form control's hidden input (spec/README.md, "Forms"), created by the directive itself: a
 * root on an `<ng-container>` has no element to render it in, and a part on the consumer's own
 * element (the checkbox's `<button>`) cannot add a sibling from a template. It goes right after
 * `anchor` (the container's comment, or the host element), as React renders it after its part,
 * with the structural hidden style unless it is `type="hidden"`; it is removed with the directive.
 */
export function createHiddenInput(
    anchor: Node,
    attributes: Record<string, string>,
): HTMLInputElement {
    const input = document.createElement("input");
    for (const [name, value] of Object.entries(attributes)) {
        input.setAttribute(name, value);
    }
    if (input.type !== "hidden") {
        input.setAttribute("aria-hidden", "true");
        input.tabIndex = -1;
        Object.assign(input.style, VISUALLY_HIDDEN_INPUT_STYLE);
    }
    const insert = () =>
        anchor.parentNode?.insertBefore(input, anchor.nextSibling);
    if (anchor.parentNode !== null) {
        insert();
    } else {
        // the root node of a view that is not attached yet (inside an `@if`)
        afterNextRender(() => {
            if (!input.isConnected) {
                insert();
            }
        });
    }
    inject(DestroyRef).onDestroy(() => input.remove());
    return input;
}

/** Sets or removes an attribute of the hidden input (`null` removes it). */
export function setInputAttribute(
    input: HTMLInputElement,
    name: string,
    value: string | null,
): void {
    if (value === null) {
        input.removeAttribute(name);
    } else {
        input.setAttribute(name, value);
    }
}
