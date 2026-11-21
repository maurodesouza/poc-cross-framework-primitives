import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/checkbox.md: anatomy, state attributes, the hidden inputs
test("checkbox / basic: parts, states and hidden inputs", async ({ page }) => {
    await openScenario(page, "/checkbox/basic");
    const roots = part(page, "checkbox", "root");
    await expect(roots).toHaveCount(3);
    const terms = page.getByRole("checkbox", { name: "Accept terms" });
    await expect(terms).toHaveAttribute("data-checkbox-part", "root");
    await expect(terms).toHaveAttribute("type", "button");
    await expect(terms).toHaveAttribute("data-unchecked", "");
    await expect(terms).not.toHaveAttribute("data-checked");
    await expect(terms).toHaveAttribute("data-required", "");
    await expect(part(terms, "checkbox", "indicator")).toHaveCount(0);

    const news = page.getByRole("checkbox", { name: "Subscribe" });
    await expect(news).toHaveAttribute("data-checked", "");
    const indicator = part(news, "checkbox", "indicator");
    await expect(indicator).toHaveAttribute("aria-hidden", "true");
    await expect(indicator).toHaveAttribute("data-checked", "");

    const locked = page.getByRole("checkbox", { name: "Locked" });
    await expect(locked).toHaveAttribute("data-disabled", "");

    const inputs = part(page, "checkbox", "input");
    await expect(inputs).toHaveCount(3);
    for (const input of await inputs.all()) {
        await expect(input).toHaveAttribute("type", "checkbox");
        await expect(input).toHaveAttribute("aria-hidden", "true");
        await expect(input).toHaveAttribute("tabindex", "-1");
    }
    await expect(inputs.nth(0)).toHaveAttribute("name", "terms");
    await expect(inputs.nth(0)).toHaveAttribute("required", "");
    await expect(inputs.nth(1)).toHaveAttribute("value", "yes");

    await terms.click();
    await expect(terms).toHaveAttribute("data-checked", "");
    await expect(terms).not.toHaveAttribute("data-unchecked");
    await expect(part(terms, "checkbox", "indicator")).toHaveCount(1);
    await expect(inputs.nth(0)).toBeChecked();
    await expectNoFalseStates(page.locator("[data-checkbox-part]"));
});

test("checkbox / group: the group, the parent's mixed state and its controls", async ({
    page,
}) => {
    await openScenario(page, "/checkbox/group");
    const group = page.locator('[data-checkbox-group-part="root"]');
    await expect(group).toHaveAttribute("role", "group");
    const parent = page.getByRole("checkbox", { name: "All toppings" });
    await expect(parent).toHaveAttribute("data-indeterminate", "");
    await expect(parent).not.toHaveAttribute("data-checked");
    await expect(part(parent, "checkbox", "indicator")).toHaveAttribute(
        "data-indeterminate",
        "",
    );
    const ids = await Promise.all(
        ["Cheese", "Ham", "Pineapple"].map((name) =>
            page.getByRole("checkbox", { name }).getAttribute("id"),
        ),
    );
    expect(ids.every((id) => id !== null)).toBe(true);
    await expect(parent).toHaveAttribute("aria-controls", ids.join(" "));
    await expectNoFalseStates(
        page.locator("[data-checkbox-part], [data-checkbox-group-part]"),
    );
});
