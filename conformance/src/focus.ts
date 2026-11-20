import { expect, type Locator } from "@playwright/test";

/** Waits until focus is on the element or inside it (a calendar cell may focus its content). */
export async function expectFocusWithin(locator: Locator): Promise<void> {
    await expect
        .poll(() =>
            locator.evaluate((element) =>
                element.contains(element.ownerDocument.activeElement),
            ),
        )
        .toBe(true);
}

/** Whether the element is inert, or hidden from assistive technologies by an ancestor. */
export async function isInertOrHidden(locator: Locator): Promise<boolean> {
    return locator.evaluate(
        (element) =>
            element.closest("[inert]") !== null ||
            element.closest('[aria-hidden="true"]') !== null,
    );
}
