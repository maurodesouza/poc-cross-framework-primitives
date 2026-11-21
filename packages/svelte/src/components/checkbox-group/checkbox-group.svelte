<script lang="ts">
import { untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    CheckboxGroupContext,
    CheckboxGroupState,
} from "./checkbox-group-context.svelte.ts";

const NONE: readonly string[] = [];

/** Checkboxes sharing one array value (`bind:value`), with an optional parent (spec/checkbox.md). */
let {
    child,
    children,
    value = $bindable(),
    defaultValue = NONE,
    onValueChange,
    allValues = NONE,
    disabled = false,
    ...rest
}: PartProps<{ disabled: boolean }> & {
    value?: string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[], details: ChangeDetails) => void;
    /** Every child value: what the parent checkbox checks. */
    allValues?: readonly string[];
    disabled?: boolean;
} = $props();

CheckboxGroupContext.provide(
    new CheckboxGroupState(
        {
            read: () => value,
            write: (next) => (value = next),
            initial: untrack(() => defaultValue),
            onChange: () => onValueChange,
        },
        {
            allValues: () => allValues,
            defaultValue: () => defaultValue,
            disabled: () => disabled,
        },
    ),
);
const partState = $derived({ disabled });
const partProps = $derived(
    mergeProps(
        {
            role: "group",
            "data-checkbox-group-part": "root",
            ...stateAttributes({ disabled }),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
