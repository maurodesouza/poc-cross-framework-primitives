import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/tabs.md: anatomy, state attributes, indicator variables
test("tabs / automatic: parts, orientation, activation, selection", async ({
    page,
}) => {
    await openScenario(page, "/tabs/automatic");
    const root = part(page, "tabs", "root");
    await expect(root).toHaveAttribute("data-orientation", "horizontal");
    await expect(root).toHaveAttribute("data-activation", "automatic");
    await expect(part(page, "tabs", "list")).toHaveAttribute(
        "data-orientation",
        "horizontal",
    );
    const tabs = part(page, "tabs", "tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute("data-selected", "");
    await expect(tabs.nth(1)).not.toHaveAttribute("data-selected");
    await expect(tabs.nth(2)).toHaveAttribute("data-disabled", "");
    await expect(part(page, "tabs", "panel")).toHaveAttribute(
        "data-selected",
        "",
    );
    const indicator = part(page, "tabs", "indicator");
    await expect(indicator).toHaveAttribute("aria-hidden", "true");
    const width = await indicator.evaluate((element) =>
        getComputedStyle(element).getPropertyValue(
            "--tabs-indicator-inline-size",
        ),
    );
    expect(width.trim()).toMatch(/px$/);
    await expectNoFalseStates(page.locator("[data-tabs-part]"));
});

test("tabs / manual and vertical: the root reports them", async ({ page }) => {
    await openScenario(page, "/tabs/manual");
    await expect(part(page, "tabs", "root")).toHaveAttribute(
        "data-activation",
        "manual",
    );
    await openScenario(page, "/tabs/vertical");
    await expect(part(page, "tabs", "root")).toHaveAttribute(
        "data-orientation",
        "vertical",
    );
    await expect(part(page, "tabs", "tab").first()).toHaveAttribute(
        "data-orientation",
        "vertical",
    );
});
