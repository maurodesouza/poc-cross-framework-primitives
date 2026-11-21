import {
    type FieldErrorMatch,
    fieldErrorShown,
    fieldStateAttributes,
} from "@poc/dom";
import {
    computed,
    defineComponent,
    h,
    type PropType,
    shallowRef,
    useId,
    watch,
} from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldKey } from "./field-context.ts";

/**
 * An error message, rendered only while shown: its slot, or the field's messages (one as text,
 * several as a list) (spec/field.md).
 */
export const FieldError = defineComponent({
    name: "FieldError",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** A `ValidityState` key (`"customError"` for `validate`'s messages), or `true` for always. */
        match: {
            type: [Boolean, String] as PropType<FieldErrorMatch>,
            default: undefined,
        },
        id: { type: String, default: undefined },
    },
    setup(props, { attrs, slots }) {
        const field = useRequiredContext(FieldKey, "Field.Error");
        const generated = useId();
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        const shown = computed(() =>
            fieldErrorShown(props.match, field.shown.value, {
                invalid: field.invalid.value,
                disabled: field.disabled(),
            }),
        );
        watch(
            element,
            (node, _, onCleanup) => {
                if (node !== null) {
                    onCleanup(field.registerMessage(node));
                }
            },
            { flush: "post" },
        );
        return () => {
            if (!shown.value) {
                return null;
            }
            const state = field.state.value;
            const errors = field.shown.value.errors;
            const content = slots.default
                ? () => slots.default?.({ state })
                : () =>
                      errors.length > 1
                          ? h(
                                "ul",
                                errors.map((message) =>
                                    h("li", { key: message }, message),
                                ),
                            )
                          : (errors[0] ?? null);
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                state,
                {
                    id: props.id ?? generated,
                    "data-field-part": "error",
                    ...stateAttributes(fieldStateAttributes(state)),
                    ref: setElement,
                },
                content,
            );
        };
    },
});
