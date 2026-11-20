let lastInputWasKeyboard = false;
let listening = false;

/**
 * Whether the last focus came from the keyboard (for overlays that highlight on keyboard open
 * only). Starts listening on first call.
 */
export function isKeyboardModality(doc: Document): boolean {
    if (!listening) {
        listening = true;
        doc.addEventListener(
            "keydown",
            () => {
                lastInputWasKeyboard = true;
            },
            true,
        );
        doc.addEventListener(
            "pointerdown",
            () => {
                lastInputWasKeyboard = false;
            },
            true,
        );
    }
    return lastInputWasKeyboard;
}
