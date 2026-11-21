<script lang="ts">
import {
    type FieldState,
    type FieldValidate,
    type FieldValidationMode,
    fieldStateAttributes,
} from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldContext, FieldRootState } from "./field-context.svelte.ts";

/** Holds the field's state, validation and ids (spec/field.md). */
let {
    child,
    children,
    name,
    disabled = false,
    invalid = false,
    validate,
    validationMode = "onSubmit",
    ...rest
}: PartProps<FieldState> & {
    /** The control's form name; it wins over the control's own. */
    name?: string;
    disabled?: boolean;
    /** Forces the invalid state (an error the app found). */
    invalid?: boolean;
    validate?: FieldValidate;
    validationMode?: FieldValidationMode;
} = $props();

const field = new FieldRootState(() => ({
    name,
    disabled,
    invalid,
    validate,
    validationMode,
}));
FieldContext.provide(field);

const partState = $derived(field.state);
const partProps = $derived(
    mergeProps(
        {
            "data-field-part": "root",
            ...stateAttributes(fieldStateAttributes(partState)),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
