import { VISUALLY_HIDDEN_INPUT_STYLE } from "@poc/dom";

/**
 * `VISUALLY_HIDDEN_INPUT_STYLE` as a `style` string (Svelte's `style` takes CSS text, with CSS
 * property names).
 */
export const HIDDEN_INPUT_STYLE = Object.entries(VISUALLY_HIDDEN_INPUT_STYLE)
    .map(
        ([key, value]) =>
            `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value}`,
    )
    .join("; ");
