<script lang="ts">
import {
    type FieldErrorMatch,
    type FieldState,
    fieldErrorShown,
    fieldStateAttributes,
} from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext } from "./field-context.svelte.ts";

/**
 * An error message, rendered only while shown: its children, or the field's messages (one as
 * text, several as a list) (spec/field.md).
 */
let {
    child,
    children,
    match,
    id: idProp,
    ...rest
}: PartProps<FieldState> & {
    /** A `ValidityState` key (`"customError"` for `validate`'s messages), or `true` for always. */
    match?: FieldErrorMatch;
    id?: string;
} = $props();
const field = FieldContext.use("Field.Error");
const generatedId = $props.id();
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
const shown = $derived(fieldErrorShown(match, field.shown, field));
$effect(() =>
    element === null || !shown ? undefined : field.registerMessage(element),
);
const errors = $derived(field.shown.errors);

const partState = $derived(field.state);
const partProps = $derived(
    mergeProps(
        {
            id: idProp ?? generatedId,
            "data-field-part": "error",
            ...stateAttributes(fieldStateAttributes(partState)),
            ...ref,
        },
        rest,
    ),
);
</script>

{#snippet messages()}{#if children}{@render children()}{:else if errors.length > 1}<ul>{#each errors as message (message)}<li>{message}</li>{/each}</ul>{:else}{errors[0]}{/if}{/snippet}{#if shown}{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render messages()}</div>{/if}{/if}
