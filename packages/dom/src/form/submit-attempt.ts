/**
 * Calls `attempt` on each submission attempt of `form` (spec/field.md, "When the result is
 * shown"): the browser's validation found a control invalid (its `invalid` event, which does not
 * bubble, caught in the capture phase), or the form submits. Returns the cleanup.
 */
export function onSubmitAttempt(
    form: HTMLFormElement,
    attempt: () => void,
): () => void {
    form.addEventListener("invalid", attempt, true);
    form.addEventListener("submit", attempt, true);
    return () => {
        form.removeEventListener("invalid", attempt, true);
        form.removeEventListener("submit", attempt, true);
    };
}
