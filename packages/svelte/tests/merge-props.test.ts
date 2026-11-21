import { describe, expect, it } from "vitest";
import { mergeProps } from "../src/utils/merge-props.ts";
import { stateAttributes } from "../src/utils/state-attributes.ts";

describe("mergeProps (Svelte)", () => {
    it("runs the part's handler first, joins classes, keeps attachments, lets other props win", () => {
        const calls: string[] = [];
        const attachment = Symbol("attachment");
        const merged = mergeProps(
            {
                class: "a",
                role: "dialog",
                onclick: () => calls.push("part"),
                [attachment]: "x",
            },
            {
                class: "b",
                role: "alertdialog",
                onclick: () => calls.push("consumer"),
            },
        );
        (merged.onclick as () => void)();
        expect(calls).toEqual(["part", "consumer"]);
        expect(merged.class).toEqual(["a", "b"]);
        expect(merged.role).toBe("alertdialog");
        expect(merged[attachment]).toBe("x");
    });

    it("never writes false states", () => {
        expect(stateAttributes({ open: true, disabled: false })).toEqual({
            "data-open": "",
        });
    });
});
