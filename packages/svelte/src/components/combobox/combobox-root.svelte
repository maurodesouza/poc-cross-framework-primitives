<script lang="ts" generics="Item">
import {
    bridgeForm,
    type ItemEquality,
    type ItemFilter,
    type ItemGroup,
    itemLabel,
} from "@poc/dom";
import { flushSync, type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { HIDDEN_INPUT_STYLE } from "../../utils/hidden-input-style.ts";
import { useFieldControl } from "../../utils/use-field-control.svelte.ts";
import { ComboboxContext, ComboboxState } from "./combobox-context.svelte.ts";

/**
 * Holds the combobox's state (`bind:value`, `bind:inputValue`, `bind:open`); renders its hidden
 * form inputs (spec/combobox.md).
 */
let {
    items,
    filter,
    limit = -1,
    locale,
    multiple = false,
    value = $bindable(),
    defaultValue,
    onValueChange,
    inputValue = $bindable(),
    defaultInputValue,
    onInputValueChange,
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    isItemEqualToValue,
    itemToStringLabel,
    itemToStringValue,
    name,
    required = false,
    disabled: disabledProp = false,
    children,
}: {
    /** The items, or groups of items: the combobox filters them (spec/combobox.md). */
    items?: readonly (Item | ItemGroup<Item>)[];
    /** Whether an item matches the query; `null` turns filtering off. */
    filter?: ItemFilter<Item> | null;
    /** The most items the list renders; `-1` for no limit. */
    limit?: number;
    locale?: string;
    multiple?: boolean;
    /** The selected item or `null`; with `multiple`, the selected items. */
    value?: Item | null | readonly Item[];
    defaultValue?: Item | null | readonly Item[];
    // biome-ignore lint/suspicious/noExplicitAny: an item, `null`, or the list of items (`multiple`)
    onValueChange?: (value: any, details: ChangeDetails) => void;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string, details: ChangeDetails) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    isItemEqualToValue?: ItemEquality<Item>;
    itemToStringLabel?: (item: Item) => string;
    itemToStringValue?: (item: Item) => string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    children?: Snippet;
} = $props();

// read at reset time too: the form reset takes the current default (as React does)
const currentDefault = (): unknown => defaultValue ?? (multiple ? [] : null);
const initialValue: unknown = untrack(currentDefault);
let hidden = $state<HTMLInputElement | null>(null);
// its options are read once the state below exists (in effects and handlers)
const field = useFieldControl({
    // the input's rendered id: the consumer's, else the generated one
    id: () => combobox.trigger?.id || combobox.triggerId,
    labelable: true,
    value: () => combobox.value,
    filled: () => combobox.values.length > 0,
    input: () => hidden,
});
const disabled = $derived(disabledProp || field.disabled);

const combobox: ComboboxState = new ComboboxState(
    {
        read: () => open,
        write: (next) => (open = next),
        initial: untrack(() => defaultOpen),
        onOpenChange: () => onOpenChange,
    },
    {
        read: () => value,
        write: (next) => (value = next as Item | null | readonly Item[]),
        initial: initialValue,
        onChange: () => onValueChange,
    },
    {
        read: () => inputValue,
        write: (next) => (inputValue = next),
        initial: untrack(
            () =>
                defaultInputValue ??
                (multiple
                    ? ""
                    : itemLabel(
                          value ?? initialValue,
                          itemToStringLabel as
                              | ((item: unknown) => string)
                              | undefined,
                      )),
        ),
        onChange: () => onInputValueChange,
    },
    {
        items: () => items as readonly unknown[] | undefined,
        filter: () => filter as ItemFilter<unknown> | null | undefined,
        limit: () => limit,
        locale: () => locale,
        multiple: () => multiple,
        isItemEqualToValue: () =>
            isItemEqualToValue as ItemEquality<unknown> | undefined,
        itemToStringLabel: () =>
            itemToStringLabel as ((item: unknown) => string) | undefined,
        itemToStringValue: () =>
            itemToStringValue as ((item: unknown) => string) | undefined,
        disabled: () => disabled,
        field,
    },
);
ComboboxContext.provide(combobox);

$effect(() => {
    const element = hidden;
    if (element === null) {
        return undefined;
    }
    return bridgeForm(element, {
        reset: () => {
            const initial = untrack(currentDefault);
            combobox.setValue(initial, "none");
            combobox.setInputValue(
                combobox.multiple ? "" : combobox.label(initial),
                "none",
            );
            // the browser reset the inputs to their own defaults: write the state back (an
            // unchanged value does not re-run the bindings)
            flushSync();
            element.value = combobox.multiple
                ? ""
                : combobox.formValue(combobox.value);
            const input = combobox.trigger;
            if (input instanceof HTMLInputElement) {
                input.value = combobox.inputValue;
            }
        },
        invalid: () => combobox.trigger,
    });
});

const fieldName = $derived(field.name ?? name);
</script>

{@render children?.()}<input bind:this={hidden} aria-hidden="true" tabindex={-1} name={multiple ? undefined : fieldName} value={multiple ? "" : combobox.formValue(combobox.value)} required={multiple ? required && combobox.values.length === 0 : required} {disabled} style={HIDDEN_INPUT_STYLE} data-combobox-part="hidden-input" />{#if multiple && fieldName !== undefined}{#each combobox.values as item, index (index)}<input type="hidden" name={fieldName} value={combobox.formValue(item)} {disabled} data-combobox-part="hidden-input" />{/each}{/if}
