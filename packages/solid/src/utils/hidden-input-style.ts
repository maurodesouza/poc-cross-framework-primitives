import { VISUALLY_HIDDEN_INPUT_STYLE } from "@poc/dom";
import type { JSX } from "@solidjs/web";

/**
 * `VISUALLY_HIDDEN_INPUT_STYLE` (spec/README.md, "Forms") as Solid takes a style object: CSS
 * property names (`clip-path`), not DOM ones (`clipPath`).
 */
export const HIDDEN_INPUT_STYLE: JSX.CSSProperties = Object.fromEntries(
    Object.entries(VISUALLY_HIDDEN_INPUT_STYLE).map(([key, value]) => [
        key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
        value,
    ]),
);
