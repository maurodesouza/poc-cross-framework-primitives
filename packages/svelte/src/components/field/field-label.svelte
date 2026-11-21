<script lang="ts">
import { type FieldState, fieldStateAttributes } from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.svelte.ts";

/** Names the field's control: `for` a labelable control, `aria-labelledby` on any (spec/field.md). */
let {
    child,
    children,
    id: idProp,
    ...rest
}: PartProps<FieldState> & { id?: string } = $props();
const field = FieldContext.use("Field.Label");
const generatedId = $props.id();
const id = $derived(idProp ?? generatedId);
$effect(() => {
    field.labelId = id;
    return () => {
        field.labelId = undefined;
    };
});

const partState = $derived(field.state);
const partProps = $derived(
    mergeProps(
        {
            id,
            for: field.control?.labelable ? field.control.id : undefined,
            "data-field-part": "label",
            ...stateAttributes(fieldStateAttributes(partState)),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<label {...partProps}>{@render children?.()}</label>{/if}
