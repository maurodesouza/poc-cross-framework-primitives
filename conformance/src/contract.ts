import { expect, type Locator, type Page } from "@playwright/test";

/** Every element of one part: `[data-<component>-part="<part>"]` (spec/README.md). */
export function part(
    page: Page | Locator,
    component: string,
    name: string,
): Locator {
    return page.locator(`[data-${component}-part="${name}"]`);
}

/** A boolean state attribute is present (empty) or absent, never `"false"`. */
export async function expectNoFalseStates(locator: Locator): Promise<void> {
    const falseStates = await locator.evaluateAll((elements) =>
        elements.flatMap((element) =>
            [...element.attributes]
                .filter(
                    (attribute) =>
                        attribute.name.startsWith("data-") &&
                        attribute.value === "false",
                )
                .map(
                    (attribute) =>
                        `${element.tagName}[${attribute.name}="false"]`,
                ),
        ),
    );
    expect(falseStates).toEqual([]);
}
