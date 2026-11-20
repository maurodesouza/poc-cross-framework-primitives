import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/popover.md: anatomy, state attributes, positioning attributes
test("popover / basic: parts, side and align, anchor variables", async ({
    page,
}) => {
    await openScenario(page, "/popover/basic");
    await part(page, "popover", "trigger").click();
    await expect(part(page, "popover", "trigger")).toHaveAttribute(
        "data-open",
        "",
    );
    const positioner = part(page, "popover", "positioner");
    await expect(positioner).toHaveAttribute("data-side", "bottom");
    await expect(positioner).toHaveAttribute("data-align", "center");
    const anchorWidth = await positioner.evaluate((element) =>
        getComputedStyle(element).getPropertyValue("--anchor-width"),
    );
    expect(anchorWidth.trim()).toMatch(/px$/);
    const popup = part(page, "popover", "popup");
    await expect(popup).toHaveAttribute("data-side", "bottom");
    await expect(popup).toHaveAttribute("data-open", "");
    await expect(popup).not.toHaveAttribute("aria-modal");
    await expect(part(page, "popover", "title")).toHaveCount(1);
    await expect(part(page, "popover", "description")).toHaveCount(1);
    await expect(part(page, "popover", "close")).toHaveCount(1);
    await expectNoFalseStates(page.locator("[data-popover-part]"));
});

test("popover / placement: the side it ended up on", async ({ page }) => {
    await openScenario(page, "/popover/placement");
    await page.getByRole("button", { name: "Flip" }).click();
    await expect(part(page, "popover", "popup")).toHaveAttribute(
        "data-side",
        "top",
    );
});

test("popover / rtl: end stays logical", async ({ page }) => {
    await openScenario(page, "/popover/rtl", { dir: "rtl" });
    await page.getByRole("button", { name: "End" }).click();
    await expect(part(page, "popover", "popup")).toHaveAttribute(
        "data-side",
        "end",
    );
});

test("popover / arrow: hidden and sided", async ({ page }) => {
    await openScenario(page, "/popover/arrow");
    await page.getByRole("button", { name: "With arrow" }).click();
    const arrow = part(page, "popover", "arrow");
    await expect(arrow).toHaveAttribute("aria-hidden", "true");
    await expect(arrow).toHaveAttribute("data-side", "bottom");
});
