import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { useControllable } from "../src/composables/use-controllable.ts";
import { resolveFocusTarget } from "../src/utils/change-details.ts";
import { renderPart } from "../src/utils/render-part.ts";
import { stateAttributes } from "../src/utils/state-attributes.ts";

const Part = defineComponent({
    inheritAttrs: false,
    props: { as: { type: String, default: undefined } },
    setup(props, { attrs, slots }) {
        return () =>
            renderPart(
                "button",
                { attrs, slots },
                props.as,
                { open: true },
                {
                    "data-x-part": "trigger",
                    class: "internal",
                    onClick: () => calls.push("internal"),
                },
            );
    },
});
const calls: string[] = [];

describe("renderPart", () => {
    it("merges classes, runs the part's listener first, and renders `as`", async () => {
        const wrapper = mount(Part, {
            props: { as: "a" },
            attrs: { class: "consumer", onClick: () => calls.push("consumer") },
            slots: { default: () => "Go" },
        });
        const element = wrapper.get("a");
        expect(element.classes()).toEqual(["internal", "consumer"]);
        expect(element.attributes("data-x-part")).toBe("trigger");
        await element.trigger("click");
        expect(calls).toEqual(["internal", "consumer"]);
    });

    it("hands props and state to the render slot", () => {
        const wrapper = mount(Part, {
            slots: {
                render: ({
                    props,
                    state,
                }: {
                    props: Record<string, unknown>;
                    state: { open: boolean };
                }) =>
                    h("section", {
                        ...props,
                        "data-open-state": String(state.open),
                    }),
            },
        });
        expect(wrapper.get("section").attributes("data-open-state")).toBe(
            "true",
        );
    });
});

describe("useControllable", () => {
    it("keeps its own value when uncontrolled and reports changes", () => {
        const onChange = vi.fn();
        const state = useControllable<boolean, string>(
            () => undefined,
            false,
            onChange,
        );
        state.set(true, "why");
        expect(state.value.value).toBe(true);
        expect(onChange).toHaveBeenCalledWith(true, "why");
    });

    it("only reports when controlled", () => {
        const onChange = vi.fn();
        const state = useControllable<boolean, string>(
            () => false,
            false,
            onChange,
        );
        state.set(true, "why");
        expect(state.value.value).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});

describe("helpers", () => {
    it("never writes false states", () => {
        expect(
            stateAttributes({ open: true, disabled: false, side: "top" }),
        ).toEqual({ "data-open": "", "data-side": "top" });
    });

    it("resolves focus targets: elements, instances, refs and getters", () => {
        const element = document.createElement("button");
        expect(resolveFocusTarget(element)).toBe(element);
        expect(resolveFocusTarget({ $el: element })).toBe(element);
        expect(resolveFocusTarget({ value: element })).toBe(element);
        expect(resolveFocusTarget(() => ({ $el: element }))).toBe(element);
        expect(resolveFocusTarget(false)).toBe(false);
        expect(resolveFocusTarget(undefined)).toBeNull();
    });
});
