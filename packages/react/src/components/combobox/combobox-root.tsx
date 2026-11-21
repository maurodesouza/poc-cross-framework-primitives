import {
    type Align,
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
    type Side,
    toggleItem,
    VISUALLY_HIDDEN_INPUT_STYLE,
} from "@poc/dom";
import {
    type ReactNode,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import { useFieldControl } from "../../hooks/use-field-control.ts";
import {
    type OverlayRootProps,
    useOverlayRoot,
} from "../../hooks/use-overlay-root.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import {
    ComboboxContext,
    type ComboboxItemInfo,
    type PendingHighlight,
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
    children?: ReactNode;
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

const NOOP = () => {};
const NONE: readonly unknown[] = [];

/** Holds the combobox's state; renders its hidden form inputs (spec/combobox.md). */
export function ComboboxRoot<Item>(props: ComboboxRootProps<Item>) {
    const {
        items,
        filter: filterProp,
        limit = -1,
        locale,
        multiple = false,
        inputValue: inputValueProp,
        defaultInputValue,
        onInputValueChange,
        isItemEqualToValue,
        itemToStringLabel,
        itemToStringValue,
        name,
        required = false,
        disabled: disabledProp = false,
        children,
        open: openProp,
        defaultOpen,
        onOpenChange,
    } = props;
    const defaultValue: unknown =
        props.defaultValue ?? (multiple ? NONE : null);
    const root = useOverlayRoot({
        open: openProp,
        defaultOpen,
        onOpenChange,
    });
    const [value, setValue] = useControllableState<unknown, ChangeDetails>(
        props.value,
        defaultValue,
        props.onValueChange as
            | ((value: unknown, details: ChangeDetails) => void)
            | undefined,
    );
    const label = useCallback(
        (item: unknown) =>
            itemLabel(
                item,
                itemToStringLabel as ((item: unknown) => string) | undefined,
            ),
        [itemToStringLabel],
    );
    const formValue = (item: unknown) =>
        itemFormValue(
            item,
            itemToStringValue as ((item: unknown) => string) | undefined,
        );
    const isEqual = isItemEqualToValue as ItemEquality<unknown> | undefined;
    const values = useMemo<readonly unknown[]>(() => {
        if (multiple) {
            return (value as readonly unknown[] | null) ?? NONE;
        }
        return value === null || value === undefined ? NONE : [value];
    }, [multiple, value]);

    const [inputValue, setInputValueState] = useControllableState(
        inputValueProp,
        defaultInputValue ??
            (multiple ? "" : label(props.value ?? defaultValue)),
        onInputValueChange,
    );
    const hidden = useRef<HTMLInputElement>(null);
    const field = useFieldControl({
        id: root.trigger?.id || root.triggerId,
        labelable: true,
        value,
        filled: values.length > 0,
        input: () => hidden.current,
    });
    const disabled = disabledProp || field.disabled;
    const [highlighted, setHighlighted] = useState<string | null>(null);
    const registered = useMemo(
        () => new Map<HTMLElement, ComboboxItemInfo>(),
        [],
    );
    const [list, setList] = useState<HTMLElement | null>(null);
    const [button, setButton] = useState<HTMLElement | null>(null);
    const [inputGroup, setInputGroup] = useState<HTMLElement | null>(null);
    const [chips, setChips] = useState<HTMLElement | null>(null);
    const [clearButton, setClearButton] = useState<HTMLElement | null>(null);
    const [itemCount, setItemCount] = useState(0);
    const [typed, setTyped] = useState(false);
    const pendingHighlight = useRef<PendingHighlight>(null);
    const [placed, setPlaced] = useState<{ side: Side; align: Align }>({
        side: "bottom",
        align: "start",
    });
    const listId = `${useId()}-list`;

    const setInputValue = useCallback(
        (next: string, reason: ChangeReason) =>
            setInputValueState(next, { reason }),
        [setInputValueState],
    );
    const latest = useRef({ value, values, inputValue, multiple, label });
    latest.current = { value, values, inputValue, multiple, label };

    const { setOpen: setOpenState } = root;
    const setOpen = useCallback(
        (next: boolean, reason: ChangeReason) => {
            if (!next || reason !== "input-change") {
                setTyped(false);
            }
            setOpenState(next, reason);
            if (next) {
                return;
            }
            // a list reopened during its exit animation starts with no highlight
            setHighlighted(null);
            pendingHighlight.current = null;
            if (reason === "item-press") {
                return;
            }
            // closing without a choice resets the text (spec/combobox.md, "Choosing an item")
            const current = latest.current;
            const text = current.multiple ? "" : current.label(current.value);
            if (current.inputValue !== text) {
                setInputValueState(text, {
                    reason: text === "" ? "input-clear" : "none",
                });
            }
        },
        [setOpenState, setInputValueState],
    );

    const choose = useCallback(
        (item: unknown) => {
            const current = latest.current;
            setHighlighted(null);
            if (!current.multiple) {
                setValue(item, { reason: "item-press" });
                setInputValueState(current.label(item), {
                    reason: "item-press",
                });
                setOpen(false, "item-press");
                return;
            }
            setValue(toggleItem(current.values, item, isEqual), {
                reason: "item-press",
            });
            if (current.inputValue.trim() !== "") {
                setInputValueState("", { reason: "input-clear" });
                setOpen(false, "item-press");
            }
        },
        [setValue, setInputValueState, setOpen, isEqual],
    );
    const clear = useCallback(
        (reason: ChangeReason) => {
            setInputValueState("", { reason });
            setValue(latest.current.multiple ? [] : null, { reason });
            setHighlighted(null);
        },
        [setInputValueState, setValue],
    );
    const removeAt = useCallback(
        (index: number, reason: ChangeReason) => {
            setValue(
                latest.current.values.filter((_, at) => at !== index),
                { reason },
            );
        },
        [setValue],
    );
    const isSelected = useCallback(
        (item: unknown) => includesItem(values, item, isEqual),
        [values, isEqual],
    );
    const markTyped = useCallback(() => setTyped(true), []);

    const filter = useMemo(
        () =>
            filterProp === undefined
                ? containsFilter<unknown>(locale)
                : (filterProp as ItemFilter<unknown> | null),
        [filterProp, locale],
    );
    const entries = useMemo(() => {
        if (items === undefined) {
            return NONE;
        }
        const query = inputValue.trim();
        // a single combobox that opened on its selected item's label shows every item
        const whole =
            !multiple &&
            !typed &&
            values.length > 0 &&
            queryIsLabel(label(values[0]), query, locale);
        return filterItems(items as readonly unknown[], whole ? "" : query, {
            filter,
            limit,
            itemToString: label,
        });
    }, [
        items,
        inputValue,
        multiple,
        typed,
        values,
        label,
        locale,
        filter,
        limit,
    ]);

    const reset = useRef({ defaultValue, setValue, setInputValueState, label });
    reset.current = { defaultValue, setValue, setInputValueState, label };
    const triggerElement = root.trigger;
    useEffect(() => {
        const element = hidden.current;
        if (element === null) {
            return undefined;
        }
        return bridgeForm(element, {
            reset: () => {
                const current = reset.current;
                current.setValue(current.defaultValue, { reason: "none" });
                current.setInputValueState(
                    latest.current.multiple
                        ? ""
                        : current.label(current.defaultValue),
                    { reason: "none" },
                );
            },
            invalid: () => triggerElement,
        });
    }, [triggerElement]);

    const context = useMemo(
        () => ({
            ...root,
            setOpen,
            field,
            multiple,
            value,
            values,
            inputValue,
            setInputValue,
            disabled,
            highlighted,
            setHighlighted,
            isSelected,
            choose,
            clear,
            removeAt,
            label,
            hasItems: items !== undefined,
            entries,
            markTyped,
            items: registered,
            list,
            setList,
            button,
            setButton,
            inputGroup,
            setInputGroup,
            chips,
            setChips,
            clearButton,
            setClearButton,
            listId,
            pendingHighlight,
            placed,
            setPlaced,
            itemCount,
            setItemCount,
        }),
        [
            root,
            setOpen,
            field,
            multiple,
            value,
            values,
            inputValue,
            setInputValue,
            disabled,
            highlighted,
            isSelected,
            choose,
            clear,
            removeAt,
            label,
            items,
            entries,
            markTyped,
            registered,
            list,
            button,
            inputGroup,
            chips,
            clearButton,
            listId,
            placed,
            itemCount,
        ],
    );
    const fieldName = field.name ?? name;
    return (
        <ComboboxContext.Provider value={context}>
            {children}
            <input
                ref={hidden}
                aria-hidden="true"
                tabIndex={-1}
                name={multiple ? undefined : fieldName}
                value={multiple ? "" : formValue(value)}
                required={multiple ? required && values.length === 0 : required}
                disabled={disabled}
                onChange={NOOP}
                style={VISUALLY_HIDDEN_INPUT_STYLE}
                data-combobox-part="hidden-input"
            />
            {multiple && fieldName !== undefined
                ? values.map((item, index) => (
                      <input
                          // biome-ignore lint/suspicious/noArrayIndexKey: two values may share a form value
                          key={index}
                          type="hidden"
                          name={fieldName}
                          value={formValue(item)}
                          disabled={disabled}
                          data-combobox-part="hidden-input"
                      />
                  ))
                : null}
        </ComboboxContext.Provider>
    );
}
