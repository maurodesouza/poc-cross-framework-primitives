import type { FieldState } from "@poc/dom";
import {
    computed,
    defineComponent,
    inject,
    nextTick,
    shallowRef,
    useId,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import { useFieldControl } from "../../composables/use-field-control.ts";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { FieldKey } from "./field-context.ts";

const OUTSIDE_STATE: FieldState = {
    valid: null,
    dirty: false,
    touched: false,
    filled: false,
    focused: false,
    disabled: false,
};

/** The field's native input (`v-model:value`, spec/field.md); every native attribute is forwarded. */
export const FieldControl = defineComponent({
    name: "FieldControl",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: { type: String, default: undefined },
        defaultValue: { type: String, default: "" },
        id: { type: String, default: undefined },
        name: { type: String, default: undefined },
        disabled: { type: Boolean, default: false },
    },
    emits: {
        "update:value": (_value: string) => true,
        valueChange: (_value: string, _details: ChangeDetails) => true,
    },
    setup(props, { attrs, slots, emit }) {
        const context = inject(FieldKey, null);
        const generated = useId();
        const id = computed(() => props.id ?? generated);
        const own = useControllable<string, ChangeDetails>(
            () => props.value,
            props.defaultValue,
            (next, details) => {
                emit("update:value", next);
                emit("valueChange", next, details);
            },
        );
        const input = shallowRef<HTMLInputElement | null>(null);
        const setInput = elementSetter(input as { value: HTMLElement | null });
        const field = useFieldControl({
            id: () => id.value,
            labelable: true,
            value: () => own.value.value,
            filled: () => own.value.value !== "",
            input: () => input.value,
        });
        const onInput = (event: Event) => {
            const target = event.currentTarget as HTMLInputElement;
            own.set(target.value, { reason: "none" });
            // a controlled value the consumer kept: the browser already wrote the input
            void nextTick().then(() => {
                if (target.value !== own.value.value) {
                    target.value = own.value.value;
                }
            });
        };
        return () => {
            const state = context?.state.value ?? OUTSIDE_STATE;
            const disabled = props.disabled || field.disabled();
            return renderPart(
                "input",
                { attrs, slots },
                props.as,
                state,
                {
                    id: id.value,
                    name: field.name() ?? props.name,
                    disabled,
                    value: own.value.value,
                    onInput,
                    onFocus: field.onFocus,
                    onBlur: field.onBlur,
                    ...field.aria(),
                    "data-field-part": "control",
                    ...field.attributes(),
                    // outside a field, only its own disabled state
                    ...(field.inField ? {} : stateAttributes({ disabled })),
                    ref: setInput,
                },
                () => [],
            );
        };
    },
});
