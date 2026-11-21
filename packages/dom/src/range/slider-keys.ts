export interface SliderKeyOptions {
    step: number;
    largeStep: number;
    /** The bounds the thumb can reach (`thumbBounds`). */
    min: number;
    max: number;
    orientation: "horizontal" | "vertical";
    rtl: boolean;
}

/**
 * The value a key moves a slider thumb to (spec/slider.md, "Keyboard"), before snapping and
 * clamping; `null` when the key does not move it. Shift with an arrow moves by `largeStep`.
 */
export function sliderKeyTarget(
    key: string,
    shiftKey: boolean,
    value: number,
    options: SliderKeyOptions,
): number | null {
    const amount = shiftKey ? options.largeStep : options.step;
    // in RTL the horizontal arrows swap, whatever the orientation
    const right = options.rtl ? -1 : 1;
    switch (key) {
        case "ArrowUp":
            return value + amount;
        case "ArrowDown":
            return value - amount;
        case "ArrowRight":
            return value + right * amount;
        case "ArrowLeft":
            return value - right * amount;
        case "PageUp":
            return value + options.largeStep;
        case "PageDown":
            return value - options.largeStep;
        case "Home":
            return options.min;
        case "End":
            return options.max;
        default:
            return null;
    }
}
