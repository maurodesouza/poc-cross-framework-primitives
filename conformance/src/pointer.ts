import { expect, type Locator, type Page } from "@playwright/test";

export type Axis = "horizontal" | "vertical";

/**
 * The page point at `fraction` along `locator`'s box, on a whole pixel: from the left edge
 * (horizontal) or from the bottom edge (vertical), across the middle of the other axis.
 */
export async function pointAlong(
    locator: Locator,
    fraction: number,
    axis: Axis = "horizontal",
): Promise<{ x: number; y: number }> {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    const { x, y, width, height } = box as NonNullable<typeof box>;
    return axis === "horizontal"
        ? {
              x: Math.round(x + width * fraction),
              y: Math.round(y + height / 2),
          }
        : {
              x: Math.round(x + width / 2),
              y: Math.round(y + height * (1 - fraction)),
          };
}

/** A press (down and up) at `fraction` along `locator`. */
export async function pressAlong(
    page: Page,
    locator: Locator,
    fraction: number,
    axis: Axis = "horizontal",
): Promise<void> {
    const point = await pointAlong(locator, fraction, axis);
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.up();
}

/**
 * A deterministic drag: press at the centre of `from`, then move in `steps` whole-pixel moves to
 * `to`, without releasing (the caller checks the state mid-drag, then calls `page.mouse.up()`).
 */
export async function dragFrom(
    page: Page,
    from: Locator,
    to: { x: number; y: number },
    steps = 5,
): Promise<void> {
    const box = await from.boundingBox();
    expect(box).not.toBeNull();
    const start = box as NonNullable<typeof box>;
    const x0 = Math.round(start.x + start.width / 2);
    const y0 = Math.round(start.y + start.height / 2);
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    for (let step = 1; step <= steps; step++) {
        await page.mouse.move(
            Math.round(x0 + ((to.x - x0) * step) / steps),
            Math.round(y0 + ((to.y - y0) * step) / steps),
        );
    }
}
