import { ApplicationRef, inject } from "@angular/core";

/**
 * Renders a state change at once, from an event handler (spec/menu.md, "Keyboard": a key that
 * opens or closes a level moves the focus before the next key arrives). React renders the state a
 * discrete event set before the next one; Angular's zoneless scheduler renders it in a later task,
 * after input that the browser already queued (two quick ArrowDown presses would both reach the
 * trigger). Never called during change detection.
 */
export function injectFlush(): () => void {
    const app = inject(ApplicationRef);
    return () => app.tick();
}
