import type { JSX } from "@solidjs/web";
import { createSignal, createUniqueId } from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { createPlacement } from "../../hooks/create-positioner.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import {
    ComboboxContext,
    type ComboboxContextValue,
    type ComboboxItemInfo,
} from "./combobox-context.ts";

export interface ComboboxRootProps extends OverlayRootProps {
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, details: ChangeDetails) => void;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
    disabled?: boolean;
    children?: JSX.Element;
}

/** Holds the combobox's state; renders no element (spec/combobox.md). */
export function ComboboxRoot(props: ComboboxRootProps) {
    const root = createOverlayRoot(props);
    const [value, setValue] = createControllable<string | null, ChangeDetails>(
        () => props.value,
        () => props.defaultValue ?? null,
        (next, details) => props.onValueChange?.(next, details),
    );
    const [inputValue, setInputValueState] = createControllable<
        string,
        ChangeDetails
    >(
        () => props.inputValue,
        () => props.defaultInputValue ?? "",
        (next, details) => props.onInputValueChange?.(next, details),
    );
    const [highlighted, setHighlighted] = createSignal<string | null>(null);
    const items = new Map<HTMLElement, ComboboxItemInfo>();
    const [list, setList] = createSignal<HTMLElement | null>(null);
    const [button, setButton] = createSignal<HTMLElement | null>(null);
    const [itemCount, setItemCount] = createSignal(0);
    const [placed, setPlaced] = createPlacement(() => ({
        side: "bottom",
        align: "start",
    }));

    const context: ComboboxContextValue = {
        ...root,
        value,
        inputValue,
        setInputValue: (next: string, reason: ChangeReason) =>
            setInputValueState(next, { reason }),
        disabled: () => props.disabled ?? false,
        highlighted,
        setHighlighted: (next) => setHighlighted(next),
        choose: (next) => {
            const item = [...items.values()].find(
                (candidate) => candidate.value === next,
            );
            if (item === undefined || item.disabled) {
                return;
            }
            setValue(next, { reason: "item-press" });
            setInputValueState(item.label, { reason: "item-press" });
            setHighlighted(null);
            root.setOpen(false, "item-press");
        },
        clear: () => {
            setInputValueState("", { reason: "escape-key" });
            setValue(null, { reason: "escape-key" });
        },
        items,
        list,
        setList: (element) => setList(element),
        button,
        setButton: (element) => setButton(element),
        listId: `${createUniqueId()}-list`,
        pendingHighlight: { current: null },
        placed,
        setPlaced,
        itemCount,
        setItemCount: (count) => setItemCount(count),
    };
    return <ComboboxContext value={context}>{props.children}</ComboboxContext>;
}
