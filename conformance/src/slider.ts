import { expect, type Locator } from "@playwright/test";

/**
 * A `slider`'s accessible value and bounds: `aria-valuenow` / `-valuemin` / `-valuemax`, or, for a
 * native `<input type="range">` (the baseline's thumbs), its value and `min` / `max`, which give the
 * same accessible value. The contract layer checks the spec's attributes themselves.
 */
export async function sliderState(
    slider: Locator,
): Promise<{ now: number; min: number; max: number }> {
    return slider.evaluate((element) => {
        const read = (aria: string, native: "value" | "min" | "max") => {
            const attribute = element.getAttribute(aria);
            if (attribute !== null) {
                return Number(attribute);
            }
            return element instanceof HTMLInputElement
                ? Number(element[native])
                : Number.NaN;
        };
        return {
            now: read("aria-valuenow", "value"),
            min: read("aria-valuemin", "min"),
            max: read("aria-valuemax", "max"),
        };
    });
}

/** Waits until the slider's accessible value is `value`. */
export async function expectSliderValue(
    slider: Locator,
    value: number,
): Promise<void> {
    await expect.poll(async () => (await sliderState(slider)).now).toBe(value);
}
