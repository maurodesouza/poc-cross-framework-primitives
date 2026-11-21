import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectSubmitted } from "../../src/form.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/checkbox.md
const checkbox = (page: Page, name: string) =>
    page.getByRole("checkbox", { name, exact: true });

test.describe("checkbox / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/checkbox/basic");
    });

    test("three named checkboxes, no hidden input in the tree", async ({
        page,
    }) => {
        await expect(page.getByRole("checkbox")).toHaveCount(3);
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "false",
        );
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-required",
            "true",
        );
        await expect(checkbox(page, "Subscribe")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await expect(checkbox(page, "Locked")).toBeDisabled();
    });

    test("a click on the checkbox or its label toggles it", async ({
        page,
    }) => {
        await checkbox(page, "Accept terms").click();
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await expectOutput(page, "terms", "true");
        await page.getByText("Accept terms").click();
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "false",
        );
        await expectOutput(page, "terms", "false");
    });

    test("Space toggles, Enter does not", async ({ page }) => {
        await checkbox(page, "Accept terms").focus();
        await page.keyboard.press("Space");
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await page.keyboard.press("Enter");
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await page.keyboard.press("Space");
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    test("required blocks the submission and focuses it; checked, the form submits it", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(checkbox(page, "Accept terms")).toBeFocused();
        await expectSubmitted(page, "none");
        await checkbox(page, "Accept terms").click();
        await page.getByRole("button", { name: "Submit" }).click();
        await expectSubmitted(page, "terms=on&news=yes");
    });

    test("a form reset returns every checkbox to its default", async ({
        page,
    }) => {
        baselineDeviation(
            "Base UI's Checkbox ignores a form reset (spec/checkbox.md, Baseline deviations)",
        );
        await checkbox(page, "Accept terms").click();
        await checkbox(page, "Subscribe").click();
        await expect(checkbox(page, "Subscribe")).toHaveAttribute(
            "aria-checked",
            "false",
        );
        await page.getByRole("button", { name: "Reset" }).click();
        await expect(checkbox(page, "Accept terms")).toHaveAttribute(
            "aria-checked",
            "false",
        );
        await expect(checkbox(page, "Subscribe")).toHaveAttribute(
            "aria-checked",
            "true",
        );
    });

    test("a disabled checkbox ignores clicks", async ({ page }) => {
        // forced: the press must reach the disabled checkbox's label, which then does nothing
        await page.getByText("Locked").click({ force: true });
        await expect(checkbox(page, "Locked")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    test("has no axe violation", async ({ page }) => {
        await expectNoAxeViolations(page);
    });
});

test.describe("checkbox / group", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/checkbox/group");
    });

    test("a named group whose parent is mixed", async ({ page }) => {
        await expect(
            page.getByRole("group", { name: "Toppings" }),
        ).toBeVisible();
        await expect(checkbox(page, "All toppings")).toHaveAttribute(
            "aria-checked",
            "mixed",
        );
        await expect(checkbox(page, "Cheese")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await expect(checkbox(page, "Ham")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    test("the parent checks all, then clears all", async ({ page }) => {
        await checkbox(page, "All toppings").click();
        await expectOutput(page, "value", "cheese,ham,pineapple");
        await expect(checkbox(page, "All toppings")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await checkbox(page, "All toppings").click();
        await expectOutput(page, "value", "none");
        await expect(checkbox(page, "All toppings")).toHaveAttribute(
            "aria-checked",
            "false",
        );
        await expect(checkbox(page, "Cheese")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    test("the children drive the parent's state", async ({ page }) => {
        await checkbox(page, "Ham").click();
        await expect(checkbox(page, "All toppings")).toHaveAttribute(
            "aria-checked",
            "mixed",
        );
        await checkbox(page, "Pineapple").click();
        await expect(checkbox(page, "All toppings")).toHaveAttribute(
            "aria-checked",
            "true",
        );
        await checkbox(page, "Cheese").click();
        await checkbox(page, "Ham").click();
        await checkbox(page, "Pineapple").click();
        await expect(checkbox(page, "All toppings")).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    test("every checked child submits its value", async ({ page }) => {
        await checkbox(page, "Ham").click();
        await page.getByRole("button", { name: "Submit" }).click();
        await expectSubmitted(page, "toppings=cheese&toppings=ham");
    });
});

test("checkbox / controlled: a cleared value the consumer refuses stays checked", async ({
    page,
}) => {
    await openScenario(page, "/checkbox/controlled");
    const keep = checkbox(page, "Keep me signed in");
    await expect(keep).toHaveAttribute("aria-checked", "true");
    await keep.click();
    await expectOutput(page, "requested", "false");
    await expect(keep).toHaveAttribute("aria-checked", "true");
    await expectOutput(page, "checked", "true");
    await keep.focus();
    await page.keyboard.press("Space");
    await expect(keep).toHaveAttribute("aria-checked", "true");
});
