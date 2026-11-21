import { computed, defineComponent, type PropType, provide, ref } from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CheckboxGroupKey } from "./checkbox-group-context.ts";

/** Checkboxes sharing one array value (`v-model:value`), with an optional parent (spec/checkbox.md). */
export const CheckboxGroup = defineComponent({
    name: "CheckboxGroup",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: {
            type: Array as PropType<readonly string[]>,
            default: undefined,
        },
        defaultValue: {
            type: Array as PropType<readonly string[]>,
            default: () => [],
        },
        /** Every child value: what the parent checkbox checks. */
        allValues: {
            type: Array as PropType<readonly string[]>,
            default: () => [],
        },
        disabled: { type: Boolean, default: false },
    },
    emits: {
        "update:value": (_value: string[]) => true,
        valueChange: (_value: string[], _details: ChangeDetails) => true,
    },
    setup(props, { attrs, slots, emit }) {
        const state = useControllable<readonly string[], ChangeDetails>(
            () => props.value,
            props.defaultValue,
            (next, details) => {
                emit("update:value", [...next]);
                emit("valueChange", [...next], details);
            },
        );
        const value = computed(() => state.value.value);
        const order = (values: readonly string[]) =>
            props.allValues.length === 0
                ? [...values]
                : [
                      ...props.allValues.filter((entry) =>
                          values.includes(entry),
                      ),
                      ...values.filter(
                          (entry) => !props.allValues.includes(entry),
                      ),
                  ];
        provide(CheckboxGroupKey, {
            value,
            allValues: () => props.allValues,
            disabled: () => props.disabled,
            toggle(entry, checked) {
                const current = value.value;
                state.set(
                    checked
                        ? order([
                              ...current.filter((item: string) => item !== entry),
                              entry,
                          ])
                        : current.filter((item: string) => item !== entry),
                    { reason: "none" },
                );
            },
            setAll(checked) {
                state.set(checked ? [...props.allValues] : [], {
                    reason: "none",
                });
            },
            reset() {
                state.set(props.defaultValue, { reason: "none" });
            },
            ids: ref({}),
        });
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                { disabled: props.disabled },
                {
                    role: "group",
                    "data-checkbox-group-part": "root",
                    ...stateAttributes({ disabled: props.disabled }),
                },
            );
    },
});
