<script lang="ts">
import { type FieldState, fieldStateAttributes } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.svelte.ts";

/** Describes the field's control: listed in its `aria-describedby` (spec/field.md). */
let {
    child,
    children,
    id: idProp,
    ...rest
}: PartProps<FieldState> & { id?: string } = $props();
const field = FieldContext.use("Field.Description");
const generatedId = $props.id();
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
$effect(() => (element === null ? undefined : field.registerMessage(element)));

const partState = $derived(field.state);
const partProps = $derived(
    mergeProps(
        {
            id: idProp ?? generatedId,
            "data-field-part": "description",
            ...stateAttributes(fieldStateAttributes(partState)),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<p {...partProps}>{@render children?.()}</p>{/if}
