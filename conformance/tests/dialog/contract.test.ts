import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/dialog.md: anatomy, state attributes
test("dialog / basic: parts and their open state", async ({ page }) => {
    await openScenario(page, "/dialog/basic");
    const trigger = part(page, "dialog", "trigger");
    await expect(trigger).toHaveCount(1);
    await expect(trigger).not.toHaveAttribute("data-open");
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-open", "");
    await expect(part(page, "dialog", "backdrop")).toHaveAttribute(
        "data-open",
        "",
    );
    await expect(part(page, "dialog", "backdrop")).toHaveAttribute(
        "aria-hidden",
        "true",
    );
    const popup = part(page, "dialog", "popup");
    await expect(popup).toHaveAttribute("data-open", "");
    await expect(popup).toHaveAttribute("tabindex", "-1");
    const title = part(page, "dialog", "title");
    const description = part(page, "dialog", "description");
    await expect(popup).toHaveAttribute(
        "aria-labelledby",
        (await title.getAttribute("id")) ?? "",
    );
    await expect(popup).toHaveAttribute(
        "aria-describedby",
        (await description.getAttribute("id")) ?? "",
    );
    await expect(part(page, "dialog", "close")).toHaveCount(2);
    await expectNoFalseStates(page.locator("[data-dialog-part]"));
});
