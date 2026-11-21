import {
    bridgeForm,
    containsFilter,
    filterItems,
    type ItemEquality,
    type ItemFilter,
    type ItemGroup,
    includesItem,
    itemFormValue,
    itemLabel,
    queryIsLabel,
    toggleItem,
} from "@poc/dom";
import type { JSX } from "@solidjs/web";
import {
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    For,
    flush,
    Show,
    snapshot,
} from "solid-js";
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
    ComboboxContext,
    type ComboboxContextValue,
    type ComboboxItemInfo,
} from "./combobox-context.ts";

interface ComboboxRootCommonProps<Item> extends OverlayRootProps {
    /** The items, or groups of items: the combobox filters them (spec/combobox.md). */
    items?: readonly (Item | ItemGroup<Item>)[];
    /** Whether an item matches the query; `null` turns filtering off. */
    filter?: ItemFilter<Item> | null;
    /** The most items the list renders; `-1` for no limit. */
    limit?: number;
    locale?: string;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
    isItemEqualToValue?: ItemEquality<Item>;
    itemToStringLabel?: (item: Item) => string;
    itemToStringValue?: (item: Item) => string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    children?: JSX.Element;
}

export interface ComboboxRootSingleProps<Item>
    extends ComboboxRootCommonProps<Item> {
    multiple?: false;
    value?: Item | null;
    defaultValue?: Item | null;
    onValueChange?: (value: Item | null, details: ChangeDetails) => void;
}

export interface ComboboxRootMultipleProps<Item>
    extends ComboboxRootCommonProps<Item> {
    multiple: true;
    value?: readonly Item[];
    defaultValue?: readonly Item[];
    onValueChange?: (value: Item[], details: ChangeDetails) => void;
}

export type ComboboxRootProps<Item> =
    | ComboboxRootSingleProps<Item>
    | ComboboxRootMultipleProps<Item>;

const NONE: readonly unknown[] = [];

/**
 * The default `isItemEqualToValue`: identity, through Solid's stores (a value kept in a store is
 * a proxy of the item, never the item itself).
 */
function sameItem(item: unknown, value: unknown): boolean {
    return Object.is(
        typeof item === "object" ? snapshot(item) : item,
        typeof value === "object" ? snapshot(value) : value,
    );
}

/** Holds the combobox's state; renders its hidden form inputs (spec/combobox.md). */
export function ComboboxRoot<Item>(props: ComboboxRootProps<Item>) {
    const root = createOverlayRoot(props);
    const multiple = () => props.multiple ?? false;
    const defaultValue = (): unknown =>
        props.defaultValue ?? (multiple() ? NONE : null);
    const [value, setValue] = createControllable<unknown, ChangeDetails>(
        () => props.value,
        defaultValue,
        (next, details) =>
            (
                props.onValueChange as
                    | ((value: unknown, details: ChangeDetails) => void)
                    | undefined
            )?.(next, details),
    );
    const label = (item: unknown) =>
        itemLabel(
            item,
            props.itemToStringLabel as ((item: unknown) => string) | undefined,
        );
    const formValue = (item: unknown) =>
        itemFormValue(
            item,
            props.itemToStringValue as ((item: unknown) => string) | undefined,
        );
    const isEqual = (): ItemEquality<unknown> =>
        (props.isItemEqualToValue as ItemEquality<unknown> | undefined) ??
        sameItem;
    const values = createMemo<readonly unknown[]>(() => {
        const current = value();
        if (multiple()) {
            return (current as readonly unknown[] | null) ?? NONE;
        }
        return current === null || current === undefined ? NONE : [current];
    });

    const [inputValue, setInputValueState] = createControllable<
        string,
        ChangeDetails
    >(
        () => props.inputValue,
        () =>
            props.defaultInputValue ??
            (multiple() ? "" : label(props.value ?? defaultValue())),
        (next, details) => props.onInputValueChange?.(next, details),
    );
    const [hidden, setHidden] = createSignal<HTMLInputElement | null>(null);
    const field = createFieldControl({
        // the input's rendered id: the consumer's, else the generated one
        id: () => root.trigger()?.id || root.triggerId,
        labelable: true,
        value,
        filled: () => values().length > 0,
        input: hidden,
    });
    const disabled = () => (props.disabled ?? false) || field.disabled();
    const [highlighted, setHighlighted] = createSignal<string | null>(null);
    const registered = new Map<HTMLElement, ComboboxItemInfo>();
    const [list, setList] = createSignal<HTMLElement | null>(null);
    const [button, setButton] = createSignal<HTMLElement | null>(null);
    const [inputGroup, setInputGroup] = createSignal<HTMLElement | null>(null);
    const [chips, setChips] = createSignal<HTMLElement | null>(null);
    const [clearButton, setClearButton] = createSignal<HTMLElement | null>(
        null,
    );
    const [itemCount, setItemCount] = createSignal(0);
    const [typed, setTyped] = createSignal(false);
    const [placed, setPlaced] = createPlacement(() => ({
        side: "bottom",
        align: "start",
    }));

    const setOpen = (next: boolean, reason: ChangeReason) => {
        if (!next || reason !== "input-change") {
            setTyped(false);
        }
        root.setOpen(next, reason);
        if (next || reason === "item-press") {
            return;
        }
        // closing without a choice resets the text (spec/combobox.md, "Choosing an item")
        const text = multiple() ? "" : label(value());
        if (inputValue() !== text) {
            setInputValueState(text, {
                reason: text === "" ? "input-clear" : "none",
            });
        }
    };

    const filter = createMemo(() =>
        props.filter === undefined
            ? containsFilter<unknown>(props.locale)
            : (props.filter as ItemFilter<unknown> | null),
    );
    const entries = createMemo<readonly unknown[]>(() => {
        const items = props.items;
        if (items === undefined) {
            return NONE;
        }
        const query = inputValue().trim();
        const selected = values();
        // a single combobox that opened on its selected item's label shows every item
        const whole =
            !multiple() &&
            !typed() &&
            selected.length > 0 &&
            queryIsLabel(label(selected[0]), query, props.locale);
        return filterItems(items as readonly unknown[], whole ? "" : query, {
            filter: filter(),
            limit: props.limit ?? -1,
            itemToString: label,
        });
    });

    createEffect(hidden, (element) => {
        if (element === null) {
            return undefined;
        }
        return bridgeForm(element, {
            reset: () => {
                const initial = defaultValue();
                setValue(initial, { reason: "none" });
                setInputValueState(multiple() ? "" : label(initial), {
                    reason: "none",
                });
                flush();
                // the browser reset the inputs to their attributes: write the state back
                element.value = multiple() ? "" : formValue(value());
                const input = root.trigger() as HTMLInputElement | null;
                if (input !== null) {
                    input.value = inputValue();
                }
            },
            invalid: root.trigger,
        });
    });

    const context: ComboboxContextValue = {
        ...root,
        setOpen,
        field,
        multiple,
        value,
        values,
        inputValue,
        setInputValue: (next, reason) => setInputValueState(next, { reason }),
        disabled,
        highlighted,
        setHighlighted: (next) => setHighlighted(next),
        isSelected: (item) => includesItem(values(), item, isEqual()),
        choose: (item) => {
            setHighlighted(null);
            if (!multiple()) {
                setValue(item, { reason: "item-press" });
                setInputValueState(label(item), { reason: "item-press" });
                setOpen(false, "item-press");
                return;
            }
            setValue(toggleItem(values(), item, isEqual()), {
                reason: "item-press",
            });
            if (inputValue().trim() !== "") {
                setInputValueState("", { reason: "input-clear" });
                setOpen(false, "item-press");
            }
        },
        clear: (reason) => {
            setInputValueState("", { reason });
            setValue(multiple() ? [] : null, { reason });
            setHighlighted(null);
        },
        removeAt: (index, reason) => {
            setValue(
                values().filter((_, at) => at !== index),
                { reason },
            );
        },
        label,
        hasItems: () => props.items !== undefined,
        entries,
        markTyped: () => setTyped(true),
        items: registered,
        list,
        setList: (element) => setList(element),
        button,
        setButton: (element) => setButton(element),
        inputGroup,
        setInputGroup: (element) => setInputGroup(element),
        chips,
        setChips: (element) => setChips(element),
        clearButton,
        setClearButton: (element) => setClearButton(element),
        listId: `${createUniqueId()}-list`,
        pendingHighlight: { current: null },
        placed,
        setPlaced,
        itemCount,
        setItemCount: (count) => setItemCount(count),
    };
    const fieldName = () => field.name() ?? props.name;
    const required = () => props.required ?? false;
    return (
        <ComboboxContext value={context}>
            {props.children}
            {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: tabindex -1 (Solid spells it in lower case), the hidden input never takes focus */}
            <input
                ref={(element) => setHidden(element)}
                aria-hidden="true"
                tabindex={-1}
                name={multiple() ? undefined : fieldName()}
                value={multiple() ? "" : formValue(value())}
                required={
                    multiple()
                        ? required() && values().length === 0
                        : required()
                }
                disabled={disabled()}
                style={HIDDEN_INPUT_STYLE}
                data-combobox-part="hidden-input"
            />
            <Show when={multiple() && fieldName() !== undefined}>
                <For each={values()}>
                    {(item) => (
                        <input
                            type="hidden"
                            name={fieldName()}
                            value={formValue(item)}
                            disabled={disabled()}
                            data-combobox-part="hidden-input"
                        />
                    )}
                </For>
            </Show>
        </ComboboxContext>
    );
}
