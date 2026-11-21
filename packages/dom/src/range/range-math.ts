/** The bounds and step of a range (spec/slider.md, "API"). */
export interface RangeOptions {
    min: number;
    max: number;
    step: number;
}

export interface ThumbOptions extends RangeOptions {
    /** The smallest distance between two thumbs, in steps. */
    minStepsBetweenValues: number;
}

/** Removes the floating-point noise of `min + n × step` (0.1 + 0.2), from the step's decimals. */
function roundToStepPrecision(value: number, step: number): number {
    const decimals = (String(step).split(".")[1] ?? "").length;
    return Number(value.toFixed(decimals));
}

/** `value` snapped to `min + n × step` and clamped to `[min, max]`. */
export function snapToStep(value: number, options: RangeOptions): number {
    const { min, max, step } = options;
    const snapped = min + Math.round((value - min) / step) * step;
    const clamped = Math.min(Math.max(snapped, min), max);
    return roundToStepPrecision(clamped, step);
}

/** Where `value` sits between `min` and `max`, in percent (0 to 100). */
export function valueToPercent(
    value: number,
    min: number,
    max: number,
): number {
    if (max === min) {
        return 0;
    }
    return ((value - min) / (max - min)) * 100;
}

/** The snapped value at `fraction` (0 to 1) along the range. */
export function valueAtFraction(
    fraction: number,
    options: RangeOptions,
): number {
    const clamped = Math.min(Math.max(fraction, 0), 1);
    return snapToStep(
        options.min + clamped * (options.max - options.min),
        options,
    );
}

/**
 * The fraction (0 to 1) of a point along a control's box: from the inline start (the left, the
 * right in RTL) horizontally, from the bottom vertically (spec/slider.md, "Pointer").
 */
export function fractionAlong(
    rect: { left: number; top: number; width: number; height: number },
    point: { x: number; y: number },
    orientation: "horizontal" | "vertical",
    rtl: boolean,
): number {
    if (orientation === "vertical") {
        return rect.height === 0
            ? 0
            : (rect.top + rect.height - point.y) / rect.height;
    }
    if (rect.width === 0) {
        return 0;
    }
    const fromLeft = (point.x - rect.left) / rect.width;
    return rtl ? 1 - fromLeft : fromLeft;
}

/**
 * The bounds thumb `index` can reach: its neighbours' values ∓ the minimum distance, else `min`
 * and `max` (spec/slider.md, "State attributes and ARIA").
 */
export function thumbBounds(
    values: readonly number[],
    index: number,
    options: ThumbOptions,
): { min: number; max: number } {
    const gap = options.minStepsBetweenValues * options.step;
    const previous = values[index - 1];
    const next = values[index + 1];
    return {
        min:
            previous === undefined
                ? options.min
                : roundToStepPrecision(previous + gap, options.step),
        max:
            next === undefined
                ? options.max
                : roundToStepPrecision(next - gap, options.step),
    };
}

/**
 * The thumb a press at `value` moves: the nearest one; among thumbs at the same distance (thumbs
 * on the same value), the last when the press is past them, else the first.
 */
export function nearestThumb(values: readonly number[], value: number): number {
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    values.forEach((candidate, index) => {
        const distance = Math.abs(candidate - value);
        if (
            distance < bestDistance ||
            (distance === bestDistance && value > candidate)
        ) {
            best = index;
            bestDistance = distance;
        }
    });
    return best;
}

/** `values` with thumb `index` moved to `next`, snapped and kept within its reachable bounds. */
export function moveThumb(
    values: readonly number[],
    index: number,
    next: number,
    options: ThumbOptions,
): number[] {
    const bounds = thumbBounds(values, index, options);
    const snapped = snapToStep(next, options);
    const value = Math.min(Math.max(snapped, bounds.min), bounds.max);
    return values.map((current, position) =>
        position === index ? value : current,
    );
}
