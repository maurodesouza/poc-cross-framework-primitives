import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { expectSubmitted } from "../../src/form.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/field.md
const textbox = (page: Page, name: string) =>
    page.getByRole("textbox", { name, exact: true });
const submit = (page: Page) => page.getByRole("button", { name: "Submit" });
const shown = (page: Page, text: string) =>
    expect(page.getByText(text, { exact: true })).toBeVisible();
const hidden = (page: Page, text: string) =>
    expect(page.getByText(text, { exact: true })).toHaveCount(0);

test.describe("field / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/field/basic");
    });

    test("a labelled, described control, with no error at first", async ({
        page,
    }) => {
        const email = textbox(page, "Email");
        await expect(email).toHaveAccessibleDescription("We never share it.");
        await expect(email).not.toHaveAttribute("aria-invalid");
        await hidden(page, "Enter your email.");
        await hidden(page, "Enter a valid email.");
    });

    test("a click on the label focuses the control", async ({ page }) => {
        await page.getByText("Email", { exact: true }).click();
        await expect(textbox(page, "Email")).toBeFocused();
    });

    test("leaving an empty required field shows nothing before a submission", async ({
        page,
    }) => {
        await textbox(page, "Email").focus();
        await page.keyboard.press("Tab");
        await expect(textbox(page, "Email")).not.toBeFocused();
        await hidden(page, "Enter your email.");
        await expect(textbox(page, "Email")).not.toHaveAttribute(
            "aria-invalid",
        );
    });

    test("a failed submission shows the matching error, invalid and described", async ({
        page,
    }) => {
        await submit(page).click();
        const email = textbox(page, "Email");
        await expect(email).toBeFocused();
        await expectSubmitted(page, "none");
        await expect(email).toHaveAttribute("aria-invalid", "true");
        await shown(page, "Enter your email.");
        await hidden(page, "Enter a valid email.");
        await expect(email).toHaveAccessibleDescription(
            "We never share it. Enter your email.",
        );
    });

    test("after a submission, each change validates", async ({ page }) => {
        await submit(page).click();
        const email = textbox(page, "Email");
        await shown(page, "Enter your email.");
        await email.fill("ada");
        await shown(page, "Enter a valid email.");
        await hidden(page, "Enter your email.");
        await email.fill("ada@example.com");
        await hidden(page, "Enter a valid email.");
        await expect(email).not.toHaveAttribute("aria-invalid");
        await expect(email).toHaveAccessibleDescription("We never share it.");
        await submit(page).click();
        await expectSubmitted(page, "email=ada@example.com");
    });

    test("a disabled field disables its control", async ({ page }) => {
        await expect(textbox(page, "Nickname")).toBeDisabled();
        await expect(textbox(page, "Nickname")).toHaveAccessibleDescription(
            "Shown on your profile.",
        );
    });

    test("has no axe violation, before and after a failed submission", async ({
        page,
    }) => {
        await expectNoAxeViolations(page);
        await submit(page).click();
        await shown(page, "Enter your email.");
        await expectNoAxeViolations(page);
    });
});

test.describe("field / validation", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/field/validation");
    });

    test("onChange: each change validates", async ({ page }) => {
        const username = textbox(page, "Username");
        await hidden(page, "At least 3 characters.");
        await username.click();
        await page.keyboard.type("a");
        await shown(page, "At least 3 characters.");
        await expect(username).toHaveAttribute("aria-invalid", "true");
        await expect(username).toHaveAccessibleDescription(
            "At least 3 characters.",
        );
        await page.keyboard.type("da");
        await hidden(page, "At least 3 characters.");
        await expect(username).not.toHaveAttribute("aria-invalid");
    });

    test("onBlur: leaving validates, a change clears the error", async ({
        page,
    }) => {
        const password = textbox(page, "Password");
        await password.click();
        await page.keyboard.type("abc");
        await hidden(page, "Include a number.");
        await page.keyboard.press("Tab");
        const items = page.getByRole("listitem");
        await expect(items).toHaveText([
            "Include a number.",
            "At least 8 characters.",
        ]);
        await expect(password).toHaveAttribute("aria-invalid", "true");
        await password.click();
        await page.keyboard.type("1");
        await hidden(page, "Include a number.");
        await hidden(page, "At least 8 characters.");
        await expect(password).not.toHaveAttribute("aria-invalid");
        await page.keyboard.press("Tab");
        await shown(page, "At least 8 characters.");
        await hidden(page, "Include a number.");
        await password.click();
        await page.keyboard.type("2345");
        await page.keyboard.press("Tab");
        await hidden(page, "At least 8 characters.");
        await expect(password).not.toHaveAttribute("aria-invalid");
    });

    test("onSubmit: a submission validates, then each change does", async ({
        page,
    }) => {
        const code = textbox(page, "Code");
        await code.click();
        await page.keyboard.type("ab");
        await hidden(page, "Use three capital letters.");
        await submit(page).click();
        await expectSubmitted(page, "none");
        await expect(code).toBeFocused();
        await shown(page, "Use three capital letters.");
        await expect(code).toHaveAttribute("aria-invalid", "true");
        await code.fill("AAA");
        await shown(page, "This code is taken.");
        await hidden(page, "Use three capital letters.");
        await code.fill("ABC");
        await hidden(page, "This code is taken.");
        await expect(code).not.toHaveAttribute("aria-invalid");
        await submit(page).click();
        await expectSubmitted(page, "code=ABC");
    });

    test("has no axe violation with the errors shown", async ({ page }) => {
        await textbox(page, "Username").fill("a");
        await textbox(page, "Password").fill("abc");
        await page.keyboard.press("Tab");
        await textbox(page, "Code").fill("ab");
        await submit(page).click();
        await shown(page, "At least 3 characters.");
        await shown(page, "At least 8 characters.");
        await shown(page, "Use three capital letters.");
        await expectNoAxeViolations(page);
    });
});

test.describe("field / controls", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/field/controls");
    });

    const terms = (page: Page) =>
        page.getByRole("checkbox", { name: "Accept terms", exact: true });
    const fruit = (page: Page) =>
        page.getByRole("combobox", { name: "Fruit", exact: true });

    test("a checkbox labelled and described by its field; the label toggles it", async ({
        page,
    }) => {
        await expect(terms(page)).toHaveAccessibleDescription(
            "Required to continue.",
        );
        await page.getByText("Accept terms", { exact: true }).click();
        await expect(terms(page)).toHaveAttribute("aria-checked", "true");
        await page.getByText("Accept terms", { exact: true }).click();
        await expect(terms(page)).toHaveAttribute("aria-checked", "false");
    });

    test("a select labelled and described by its field", async ({ page }) => {
        await expect(fruit(page)).toHaveAccessibleDescription("Pick one.");
    });

    test("a slider labelled and described by its field", async ({ page }) => {
        await expect(
            page.getByRole("group", { name: "Volume", exact: true }),
        ).toBeVisible();
        const slider = page.getByRole("slider", {
            name: "Volume",
            exact: true,
        });
        await expect(slider).toHaveAccessibleDescription("From 0 to 100.");
    });

    test("a failed submission marks every invalid control", async ({
        page,
    }) => {
        await submit(page).click();
        await expectSubmitted(page, "none");
        await expect(terms(page)).toHaveAttribute("aria-invalid", "true");
        await expect(fruit(page)).toHaveAttribute("aria-invalid", "true");
        await shown(page, "You must accept the terms.");
        await shown(page, "Choose a fruit.");
        await expect(terms(page)).toHaveAccessibleDescription(
            "Required to continue. You must accept the terms.",
        );
    });

    test("after a submission, each change validates; the field names the controls", async ({
        page,
    }) => {
        await submit(page).click();
        await shown(page, "You must accept the terms.");
        await terms(page).click();
        await hidden(page, "You must accept the terms.");
        await expect(terms(page)).not.toHaveAttribute("aria-invalid");
        await fruit(page).click();
        await page.getByRole("option", { name: "Banana", exact: true }).click();
        await expect(fruit(page)).toHaveText("Banana");
        await hidden(page, "Choose a fruit.");
        await expect(fruit(page)).not.toHaveAttribute("aria-invalid");
        await submit(page).click();
        await expectSubmitted(page, "terms=on&fruit=banana&volume=50");
    });

    test("has no axe violation, before and after a failed submission", async ({
        page,
    }) => {
        await expectNoAxeViolations(page);
        await submit(page).click();
        await shown(page, "Choose a fruit.");
        await expectNoAxeViolations(page);
    });
});
