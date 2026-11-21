import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/select.md: anatomy, state attributes, the hidden input
test("select / basic: parts, placeholder, hidden input, open states", async ({
    page,
}) => {
    await openScenario(page, "/select/basic");
    const trigger = part(page, "select", "trigger");
    await expect(trigger).toHaveAttribute("role", "combobox");
    await expect(trigger).toHaveAttribute("type", "button");
    await expect(trigger).toHaveAttribute("data-placeholder", "");
    await expect(trigger).toHaveAttribute("aria-required", "true");
    await expect(part(trigger, "select", "value")).toHaveAttribute(
        "data-placeholder",
        "",
    );
    const input = part(page, "select", "input");
    await expect(input).toHaveCount(1);
    await expect(input).toHaveAttribute("name", "fruit");
    await expect(input).toHaveValue("");
    await expect(input).toHaveAttribute("required", "");
    await expect(input).toHaveAttribute("aria-hidden", "true");
    await expect(input).toHaveAttribute("tabindex", "-1");
    await expect(input).not.toHaveAttribute("type", "hidden");

    await trigger.click();
    await expect(trigger).toHaveAttribute("data-open", "");
    const positioner = part(page, "select", "positioner");
    await expect(positioner).toHaveAttribute("data-side", "bottom");
    await expect(positioner).toHaveAttribute("data-align", "start");
    await expect(part(page, "select", "popup")).toHaveAttribute(
        "data-open",
        "",
    );
    const list = part(page, "select", "list");
    await expect(list).toHaveAttribute("role", "listbox");
    await expect(trigger).toHaveAttribute(
        "aria-controls",
        (await list.getAttribute("id")) as string,
    );
    const items = part(page, "select", "item");
    await expect(items).toHaveCount(7);
    await expect(items.first()).toHaveAttribute("data-highlighted", "");
    await expect(items.first()).toHaveAttribute("aria-selected", "false");
    await expect(items.last()).toHaveAttribute("data-disabled", "");
    await expect(part(page, "select", "item-indicator")).toHaveCount(0);

    await page.getByRole("option", { name: "Banana" }).click();
    await expect(input).toHaveValue("banana");
    await expect(trigger).not.toHaveAttribute("data-placeholder");
    await trigger.click();
    const banana = page.getByRole("option", { name: "Banana" });
    await expect(banana).toHaveAttribute("data-selected", "");
    await expect(banana).toHaveAttribute("data-highlighted", "");
    await expect(part(banana, "select", "item-indicator")).toHaveAttribute(
        "aria-hidden",
        "true",
    );
    await expect(part(page, "select", "item-indicator")).toHaveCount(1);
    await expectNoFalseStates(page.locator("[data-select-part]"));
});
