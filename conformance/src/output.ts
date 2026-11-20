import { expect, type Page } from "@playwright/test";

/** What the scenario printed (spec/README.md): `key: value` lines in `data-testid="output"`. */
export function output(page: Page) {
    return page.getByTestId("output");
}

/** Waits until the output has the line `key: value`. */
export async function expectOutput(
    page: Page,
    key: string,
    value: string,
): Promise<void> {
    await expect(output(page)).toHaveText(
        new RegExp(
            `(^|\\n)${escapeRegExp(key)}: ${escapeRegExp(value)}(\\n|$)`,
        ),
    );
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
