import { bridgeForm } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, createUniqueId, flush } from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import { createFieldControl } from "../../hooks/create-field-control.ts";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { createPlacement } from "../../hooks/create-positioner.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { HIDDEN_INPUT_STYLE } from "../../utils/hidden-input-style.ts";
import {
    SelectContext,
    type SelectContextValue,
    type SelectItemData,
} from "./select-context.ts";

export interface SelectRootProps extends OverlayRootProps {
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, details: ChangeDetails) => void;
    /** Every item: the Root needs their labels while the list is closed. */
    items: readonly SelectItemData[];
    name?: string;
    required?: boolean;
    disabled?: boolean;
    children?: JSX.Element;
}

/** Holds the select's state; renders its hidden form input (spec/select.md). */
export function SelectRoot(props: SelectRootProps) {
    const root = createOverlayRoot(props);
    const [value, setValue] = createControllable<string | null, ChangeDetails>(
        () => props.value,
        () => props.defaultValue ?? null,
        (next, details) => props.onValueChange?.(next, details),
    );
    const [highlighted, setHighlighted] = createSignal<string | null>(null);
    const [placed, setPlaced] = createPlacement(() => ({
        side: "bottom",
        align: "start",
    }));
    const [input, setInput] = createSignal<HTMLInputElement | null>(null);
    const baseId = createUniqueId();
    const field = createFieldControl({
        // the trigger's rendered id: the consumer's, else the generated one
        id: () => root.trigger()?.id || root.triggerId,
        labelable: true,
        value,
        filled: () => value() !== null,
        input,
    });
    const disabled = () => (props.disabled ?? false) || field.disabled();
    const items = () => props.items;

    createEffect(input, (element) => {
        if (element === null) {
            return undefined;
        }
        return bridgeForm(element, {
            reset: () => {
                setValue(props.defaultValue ?? null, { reason: "none" });
                flush();
                // the browser reset the input to its attribute: write the value back
                element.value = value() ?? "";
            },
            invalid: root.trigger,
        });
    });

    const context: SelectContextValue = {
        ...root,
        field,
        items,
        value,
        disabled,
        required: () => props.required ?? false,
        highlighted,
        setHighlighted: (next) => setHighlighted(next),
        openOn: (entry: string | null, reason: ChangeReason) => {
            setHighlighted(entry);
            root.setOpen(true, reason);
        },
        choose: (entry: string, reason: ChangeReason) => {
            const item = items().find((candidate) => candidate.value === entry);
            if (item === undefined || item.disabled) {
                return;
            }
            setValue(entry, { reason });
            root.setOpen(false, reason);
        },
        listId: `${baseId}-list`,
        itemId: (entry: string) =>
            `${baseId}-item-${items().findIndex((item) => item.value === entry)}`,
        placed,
        setPlaced,
    };
    return (
        <SelectContext value={context}>
            {props.children}
            {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: tabindex -1 (Solid spells it in lower case), the hidden input never takes focus */}
            <input
                ref={(element) => setInput(element)}
                aria-hidden="true"
                tabindex={-1}
                name={field.name() ?? props.name}
                value={value() ?? ""}
                required={props.required ?? false}
                disabled={disabled()}
                style={HIDDEN_INPUT_STYLE}
                data-select-part="input"
            />
        </SelectContext>
    );
}
