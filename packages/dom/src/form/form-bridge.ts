export interface FormBridgeOptions {
    /**
     * The input's form was reset. Called once the browser has reset its controls, so the
     * framework can return the component to its default and write it back onto the input.
     */
    reset?: () => void;
    /** The browser's validation found the input invalid: where focus goes instead (the primitive). */
    invalid?: () => HTMLElement | null;
}

/**
 * Bridges a primitive's hidden input and its form (spec/README.md, "Forms"): a form reset, and a
 * failed validation (the browser would focus the hidden input; focus goes to the primitive and the
 * browser's bubble is not shown on an invisible element). Returns the cleanup.
 */
export function bridgeForm(
    input: HTMLInputElement,
    options: FormBridgeOptions,
): () => void {
    const form = input.form;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onReset = () => {
        // the reset event fires before the browser resets the controls
        timer = setTimeout(() => {
            timer = undefined;
            options.reset?.();
        });
    };
    const onInvalid = (event: Event) => {
        const target = options.invalid?.();
        if (target) {
            event.preventDefault();
            target.focus();
        }
    };
    form?.addEventListener("reset", onReset);
    input.addEventListener("invalid", onInvalid);
    return () => {
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        form?.removeEventListener("reset", onReset);
        input.removeEventListener("invalid", onInvalid);
    };
}
