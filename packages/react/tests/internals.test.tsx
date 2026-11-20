import { act, cleanup, render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useControllableState } from "../src/hooks/use-controllable-state.ts";
import { mergeProps } from "../src/utils/merge-props.ts";
import { renderElement } from "../src/utils/render-element.tsx";
import { stateAttributes } from "../src/utils/state-attributes.ts";

afterEach(cleanup);

describe("mergeProps", () => {
    it("runs the internal handler, then the consumer's", () => {
        const calls: string[] = [];
        const merged = mergeProps(
            { onClick: () => calls.push("internal") },
            { onClick: () => calls.push("consumer") },
        );
        (merged.onClick as () => void)();
        expect(calls).toEqual(["internal", "consumer"]);
    });

    it("joins classes, merges styles and lets other consumer props win", () => {
        const merged = mergeProps(
            { className: "a", style: { top: 0, left: 0 }, role: "dialog" },
            { className: "b", style: { left: 4 }, role: "alertdialog" },
        );
        expect(merged).toEqual({
            className: "a b",
            style: { top: 0, left: 4 },
            role: "alertdialog",
        });
    });
});

describe("stateAttributes", () => {
    it("never writes false", () => {
        expect(
            stateAttributes({
                open: true,
                disabled: false,
                side: "top",
                nothing: undefined,
            }),
        ).toEqual({
            "data-open": "",
            "data-side": "top",
        });
    });
});

function Part(props: Record<string, unknown>) {
    return (
        <>
            {renderElement(
                "button",
                props,
                { open: true },
                { "data-x-part": "trigger", type: "button" },
            )}
        </>
    );
}

describe("renderElement", () => {
    it("renders the default element with className and style from the state", () => {
        const { container } = render(
            <Part
                className={(state: { open: boolean }) =>
                    state.open ? "is-open" : ""
                }
                style={() => ({ color: "red" })}
            >
                Go
            </Part>,
        );
        const button = container.querySelector("button");
        expect(button?.className).toBe("is-open");
        expect(button?.style.color).toBe("red");
        expect(button?.getAttribute("data-x-part")).toBe("trigger");
    });

    it("merges into an element given as render", () => {
        const { container } = render(
            <Part render={<a href="#x" className="link" />}>Go</Part>,
        );
        const link = container.querySelector("a");
        expect(link?.getAttribute("data-x-part")).toBe("trigger");
        expect(link?.getAttribute("href")).toBe("#x");
    });

    it("calls a render function with the props and the state", () => {
        const renderFn = vi.fn(
            (props: Record<string, unknown>, state: { open: boolean }) => (
                <span {...props} data-open-state={String(state.open)} />
            ),
        );
        const { container } = render(<Part render={renderFn} />);
        expect(
            container.querySelector("span")?.getAttribute("data-open-state"),
        ).toBe("true");
    });
});

describe("useControllableState", () => {
    it("keeps its own state when uncontrolled, and reports changes", () => {
        const onChange = vi.fn();
        const { result } = renderHook(() =>
            useControllableState<boolean, string>(undefined, false, onChange),
        );
        act(() => result.current[1](true, "why"));
        expect(result.current[0]).toBe(true);
        expect(onChange).toHaveBeenCalledWith(true, "why");
    });

    it("only reports when controlled", () => {
        const onChange = vi.fn();
        const { result } = renderHook(() =>
            useControllableState<boolean, string>(false, false, onChange),
        );
        act(() => result.current[1](true, "why"));
        expect(result.current[0]).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
