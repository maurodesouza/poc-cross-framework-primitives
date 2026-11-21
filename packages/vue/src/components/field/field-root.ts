import {
    type FieldState,
    type FieldValidate,
    type FieldValidation,
    type FieldValidationMode,
    fieldDescribedBy,
    fieldStateAttributes,
    shownAfterChange,
    UNVALIDATED,
    validateField,
    validatesOnChange,
} from "@poc/dom";
import {
    computed,
    defineComponent,
    type PropType,
    provide,
    ref,
    shallowRef,
} from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { type FieldControlEvents, FieldKey } from "./field-context.ts";

/** Holds the field's state, validation and ids (spec/field.md). */
export const FieldRoot = defineComponent({
    name: "FieldRoot",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** The control's form name; it wins over the control's own. */
        name: { type: String, default: undefined },
        disabled: { type: Boolean, default: false },
        /** Forces the invalid state (an error the app found). */
        invalid: { type: Boolean, default: false },
        validate: {
            type: Function as PropType<FieldValidate>,
            default: undefined,
        },
        validationMode: {
            type: String as PropType<FieldValidationMode>,
            default: "onSubmit",
        },
    },
    setup(props, { attrs, slots }) {
        const touched = ref(false);
        const focused = ref(false);
        const dirty = ref(false);
        const filled = ref(false);
        const shown = shallowRef<FieldValidation>(UNVALIDATED);
        const labelId = ref<string>();
        const control = shallowRef<{ id: string; labelable: boolean } | null>(
            null,
        );
        const messages = shallowRef<readonly HTMLElement[]>([]);
        // whether the value changed once, or a submission was attempted (the required rule)
        let changed = false;
        let submitted = false;

        const run = (
            input: HTMLInputElement | null,
            value: unknown,
            always: boolean,
        ) =>
            validateField(input, {
                value,
                validate: props.validate,
                valueChanged: changed,
                always,
            });
        const events: FieldControlEvents = {
            mounted: (input, value, isFilled) => {
                filled.value = isFilled;
                run(input, value, false);
            },
            changed: (input, value, isDirty, isFilled) => {
                changed = true;
                dirty.value = isDirty;
                filled.value = isFilled;
                const onChange = validatesOnChange(
                    props.validationMode,
                    submitted,
                );
                const next = run(input, value, onChange);
                shown.value = shownAfterChange(shown.value, next, onChange);
            },
            focused: () => {
                focused.value = true;
            },
            blurred: (input, value) => {
                focused.value = false;
                touched.value = true;
                if (props.validationMode === "onBlur") {
                    shown.value = run(input, value, false);
                }
            },
            submitAttempt: (input, value) => {
                submitted = true;
                changed = true;
                shown.value = run(
                    input,
                    value,
                    validatesOnChange(props.validationMode, true),
                );
            },
        };

        const state = computed<FieldState>(() => ({
            valid: props.disabled
                ? null
                : props.invalid
                  ? false
                  : shown.value.validity.valid,
            dirty: dirty.value,
            touched: touched.value,
            filled: filled.value,
            focused: focused.value,
            disabled: props.disabled,
        }));
        provide(FieldKey, {
            state,
            invalid: computed(() => state.value.valid === false),
            name: () => props.name,
            disabled: () => props.disabled,
            shown,
            labelId,
            control,
            registerControl(id, labelable) {
                const entry = { id, labelable };
                control.value = entry;
                return () => {
                    if (control.value === entry) {
                        control.value = null;
                    }
                };
            },
            describedBy: computed(() => fieldDescribedBy(messages.value)),
            registerMessage(element) {
                messages.value = [...messages.value, element];
                return () => {
                    messages.value = messages.value.filter(
                        (entry) => entry !== element,
                    );
                };
            },
            events,
        });
        return () =>
            renderPart("div", { attrs, slots }, props.as, state.value, {
                "data-field-part": "root",
                ...stateAttributes(fieldStateAttributes(state.value)),
            });
    },
});
