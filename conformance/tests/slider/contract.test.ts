import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { dragFrom, pointAlong } from "../../src/pointer.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/slider.md: anatomy, ARIA, structural styles, the hidden inputs
test("slider / basic: parts, ARIA, placement, hidden input, dragging", async ({
    page,
}) => {
    await openScenario(page, "/slider/basic");
    const root = part(page, "slider", "root");
    await expect(root).toHaveAttribute("role", "group");
    await expect(root).toHaveAttribute("data-orientation", "horizontal");
    for (const name of ["control", "track", "indicator"]) {
        await expect(part(page, "slider", name)).toHaveAttribute(
            "data-orientation",
            "horizontal",
        );
    }
    const thumb = part(page, "slider", "thumb");
    await expect(thumb).toHaveAttribute("role", "slider");
    await expect(thumb).toHaveAttribute("tabindex", "0");
    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
    await expect(thumb).toHaveAttribute("aria-valuemin", "0");
    await expect(thumb).toHaveAttribute("aria-valuemax", "100");
    await expect(thumb).toHaveAttribute("aria-orientation", "horizontal");
    await expect(thumb).toHaveAttribute("data-index", "0");
    await expect(part(page, "slider", "indicator")).toHaveCSS(
        "inline-size",
        "100px",
    );
    const input = part(page, "slider", "input");
    await expect(input).toHaveAttribute("type", "hidden");
    await expect(input).toHaveAttribute("name", "volume");
    await expect(input).toHaveValue("50");

    await dragFrom(
        page,
        thumb,
        await pointAlong(part(page, "slider", "control"), 0.7),
    );
    await expect(root).toHaveAttribute("data-dragging", "");
    await expect(thumb).toHaveAttribute("data-dragging", "");
    await expectNoFalseStates(page.locator("[data-slider-part]"));
    await page.mouse.up();
    await expect(root).not.toHaveAttribute("data-dragging");
    await expect(input).toHaveValue("70");
    await expectNoFalseStates(page.locator("[data-slider-part]"));
});

test("slider / range: each thumb's reachable bounds, one input per value", async ({
    page,
}) => {
    await openScenario(page, "/slider/range");
    const thumbs = part(page, "slider", "thumb");
    await expect(thumbs).toHaveCount(2);
    await expect(thumbs.nth(0)).toHaveAttribute("aria-valuemin", "0");
    await expect(thumbs.nth(0)).toHaveAttribute("aria-valuemax", "70");
    await expect(thumbs.nth(0)).toHaveAttribute("aria-valuetext", "$20");
    await expect(thumbs.nth(1)).toHaveAttribute("aria-valuemin", "30");
    await expect(thumbs.nth(1)).toHaveAttribute("aria-valuemax", "100");
    await expect(thumbs.nth(1)).toHaveAttribute("data-index", "1");
    const inputs = part(page, "slider", "input");
    await expect(inputs).toHaveCount(2);
    await expect(inputs.nth(0)).toHaveValue("20");
    await expect(inputs.nth(1)).toHaveValue("80");
    await expect(part(page, "slider", "indicator")).toHaveCSS(
        "inline-size",
        "120px",
    );
});

test("slider / vertical: orientation everywhere", async ({ page }) => {
    await openScenario(page, "/slider/vertical");
    await expect(part(page, "slider", "root")).toHaveAttribute(
        "data-orientation",
        "vertical",
    );
    const thumb = part(page, "slider", "thumb");
    await expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    await expect(thumb).toHaveAttribute("data-orientation", "vertical");
    await expect(part(page, "slider", "indicator")).toHaveCSS(
        "block-size",
        "60px",
    );
});
