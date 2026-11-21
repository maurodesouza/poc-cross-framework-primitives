<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    CheckboxContext,
    type CheckboxState,
    checkedAttributes,
} from "./checkbox-context.svelte.ts";

/** The check or the dash, hidden from assistive technologies (spec/checkbox.md). */
let {
    child,
    children,
    keepMounted = false,
    ...rest
}: PartProps<CheckboxState> & {
    /** Rendered in every state, not only while checked or indeterminate. */
    keepMounted?: boolean;
} = $props();
const context = CheckboxContext.use("Checkbox.Indicator");
const partState = $derived({
    checked: context.checked,
    indeterminate: context.indeterminate,
    disabled: context.disabled,
    required: context.required,
});
const partProps = $derived(
    mergeProps(
        {
            "aria-hidden": "true",
            "data-checkbox-part": "indicator",
            ...stateAttributes(checkedAttributes(partState)),
        },
        rest,
    ),
);
</script>

{#if keepMounted || context.checked || context.indeterminate}{#if child}{@render child({ props: partProps, state: partState })}{:else}<span {...partProps}>{@render children?.()}</span>{/if}{/if}
