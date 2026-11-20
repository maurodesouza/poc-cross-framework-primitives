import { describe, expect, it } from "vitest";
import {
    isLayoutName,
    isLooseSourceFile,
    layoutProblems,
} from "../scripts/check-layout.ts";

// `pnpm check` runs scripts/check-layout.ts over `git ls-files`.
describe("the source layout check", () => {
    it("takes kebab-case names, with their suffixes", () => {
        for (const name of [
            "dialog-popup.tsx",
            "menu-item.vue",
            "combobox-input.svelte",
            "use-controllable-state.ts",
            "focus-trap.test.ts",
            "tabs-list.directive.ts",
            "index.d.ts",
            "vitest.config.ts",
            "e2e",
            "v1",
        ]) {
            expect(isLayoutName(name), name).toBe(true);
        }
    });

    it("refuses any other case", () => {
        for (const name of [
            "DialogPopup.tsx",
            "menuItem.ts",
            "MenuItem.vue",
            "focus_trap.ts",
            "FocusTrap.test.ts",
            "Tab-list.tsx",
            "tab--list.ts",
            "-tab.ts",
        ]) {
            expect(isLayoutName(name), name).toBe(false);
        }
    });

    it("keeps the fixed names, a tool's dot names, and checks what follows an underscore", () => {
        expect(isLayoutName("README.md")).toBe(true);
        expect(isLayoutName("LICENSE")).toBe(true);
        expect(isLayoutName(".github")).toBe(true);
        expect(isLayoutName("_kit")).toBe(true);
        expect(isLayoutName("_Kit")).toBe(false);
    });

    it("finds a non-entry file at the root of a package's src/", () => {
        expect(isLooseSourceFile("packages/react/src/foo.ts")).toBe(true);
        expect(isLooseSourceFile("packages/dom/src/focus-trap.ts")).toBe(true);
        expect(isLooseSourceFile("packages/react/src/index.ts")).toBe(false);
        expect(isLooseSourceFile("packages/angular/src/public-api.ts")).toBe(
            false,
        );
        expect(isLooseSourceFile("packages/dom/src/focus/focus-trap.ts")).toBe(
            false,
        );
        expect(isLooseSourceFile("fixtures/react/src/main.tsx")).toBe(false);
    });

    it("reports each bad name once, with the folder it belongs to", () => {
        expect(
            layoutProblems([
                "packages/dom/src/focus/FocusTrap.ts",
                "fixtures/vue/src/scenarios/Bad_Dir/a.vue",
                "fixtures/vue/src/scenarios/Bad_Dir/b.vue",
                ".github/workflows/CI.yml",
                "packages/react/src/foo.ts",
                "packages/react/src/components/dialog/dialog-popup.tsx",
            ]),
        ).toEqual([
            "packages/dom/src/focus/FocusTrap.ts: not kebab-case",
            "fixtures/vue/src/scenarios/Bad_Dir: not kebab-case",
            expect.stringMatching(
                /^packages\/react\/src\/foo\.ts: a package's src\/ root/,
            ),
        ]);
    });
});
