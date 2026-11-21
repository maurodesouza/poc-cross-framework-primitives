import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/tooltip.md: anatomy, the description relation, instant opening
test("tooltip / basic: parts, aria-describedby, instant on focus", async ({
    page,
}) => {
    await openScenario(page, "/tooltip/basic");
    const trigger = part(page, "tooltip", "trigger");
    await expect(trigger).not.toHaveAttribute("aria-describedby");
    await page.getByRole("button", { name: "Before" }).focus();
    await page.keyboard.press("Tab");
    const popup = part(page, "tooltip", "popup");
    await expect(popup).toHaveAttribute("role", "tooltip");
    await expect(popup).toHaveAttribute("data-open", "");
    await expect(popup).toHaveAttribute("data-instant", "");
    await expect(trigger).toHaveAttribute("data-open", "");
    await expect(trigger).toHaveAttribute(
        "aria-describedby",
        (await popup.getAttribute("id")) as string,
    );
    const positioner = part(page, "tooltip", "positioner");
    await expect(positioner).toHaveAttribute("data-side", /^(top|bottom)$/);
    await expect(positioner).toHaveAttribute("data-align", "center");
    await expect(part(page, "tooltip", "arrow")).toHaveAttribute(
        "aria-hidden",
        "true",
    );
    await expectNoFalseStates(page.locator("[data-tooltip-part]"));
});

test("tooltip / group: a hand-off opens instantly", async ({ page }) => {
    await openScenario(page, "/tooltip/group");
    await page.getByRole("button", { name: "Bold" }).hover();
    await expect(
        page.getByRole("tooltip", { name: "Bold (Ctrl+B)" }),
    ).toBeVisible();
    await expect(part(page, "tooltip", "popup")).not.toHaveAttribute(
        "data-instant",
    );
    await page.getByRole("button", { name: "Italic" }).hover();
    const italic = page.getByRole("tooltip", { name: "Italic (Ctrl+I)" });
    await expect(italic).toBeVisible();
    await expect(italic).toHaveAttribute("data-instant", "");
});
