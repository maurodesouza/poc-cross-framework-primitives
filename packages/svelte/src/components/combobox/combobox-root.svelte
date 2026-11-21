<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { ComboboxContext, ComboboxState } from "./combobox-context.svelte.ts";

/** Holds the combobox's state (`bind:value`, `bind:inputValue`, `bind:open`). */
let {
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    value = $bindable(),
    defaultValue = null,
    onValueChange,
    inputValue = $bindable(),
    defaultInputValue = "",
    onInputValueChange,
    disabled = false,
    children,
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, details: ChangeDetails) => void;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (value: string, details: ChangeDetails) => void;
    disabled?: boolean;
    children?: Snippet;
} = $props();

ComboboxContext.provide(
    new ComboboxState(
        {
            read: () => open,
            write: (next) => (open = next),
            initial: untrack(() => defaultOpen),
            onOpenChange: () => onOpenChange,
        },
        {
            read: () => value,
            write: (next) => (value = next),
            initial: untrack(() => defaultValue),
            onChange: () => onValueChange,
        },
        {
            read: () => inputValue,
            write: (next) => (inputValue = next),
            initial: untrack(() => defaultInputValue),
            onChange: () => onInputValueChange,
        },
        () => disabled,
    ),
);
</script>

{@render children?.()}
