import { bridgeForm, VISUALLY_HIDDEN_INPUT_STYLE } from "@poc/dom";
import {
    computed,
    defineComponent,
    Fragment,
    h,
    inject,
    provide,
    shallowRef,
    useId,
    watch,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CheckboxGroupKey } from "../checkbox-group/checkbox-group-context.ts";
import { CheckboxKey, checkedAttributes } from "./checkbox-context.ts";

/** A `checkbox` (`v-model:checked`) with its hidden form input (spec/checkbox.md). */
export const CheckboxRoot = defineComponent({
    name: "CheckboxRoot",
    inheritAttrs: false,
    props: {
        ...asProp,
        checked: { type: Boolean, default: undefined },
        defaultChecked: { type: Boolean, default: false },
        indeterminate: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        name: { type: String, default: undefined },
        /** Submitted while checked (`"on"`); inside a CheckboxGroup, its value in the group. */
        value: { type: String, default: undefined },
        /** The CheckboxGroup's parent checkbox. */
        parent: { type: Boolean, default: false },
        id: { type: String, default: undefined },
    },
    emits: {
        "update:checked": (_checked: boolean) => true,
        checkedChange: (_checked: boolean, _details: ChangeDetails) => true,
    },
    setup(props, { attrs, slots, emit }) {
        const group = inject(CheckboxGroupKey, null);
        const generatedId = useId();
        const id = computed(() => props.id ?? generatedId);
        const own = useControllable<boolean, ChangeDetails>(
            () => props.checked,
            props.defaultChecked,
            (next, details) => {
                emit("update:checked", next);
                emit("checkedChange", next, details);
            },
        );
        const button = shallowRef<HTMLElement | null>(null);
        const setButton = elementSetter(button);
        const input = shallowRef<HTMLInputElement | null>(null);
        const inGroup = computed(
            () => group !== null && (props.parent || props.value !== undefined),
        );
        const state = computed(() => {
            let checked = own.value.value;
            let indeterminate = props.indeterminate;
            if (group !== null && inGroup.value) {
                const all = group.allValues();
                const count = all.filter((entry) =>
                    group.value.value.includes(entry),
                ).length;
                if (props.parent) {
                    checked = all.length > 0 && count === all.length;
                    indeterminate = count > 0 && !checked;
                } else {
                    checked = group.value.value.includes(props.value as string);
                }
            }
            return {
                checked,
                indeterminate,
                disabled: props.disabled || (group?.disabled() ?? false),
                required: props.required,
            };
        });
        provide(CheckboxKey, state);

        watch(
            () => [group, props.parent, props.value, id.value] as const,
            ([context, parent, value, elementId], _, onCleanup) => {
                if (context === null || parent || value === undefined) {
                    return;
                }
                context.ids.value = {
                    ...context.ids.value,
                    [value]: elementId,
                };
                onCleanup(() => {
                    const { [value]: _removed, ...rest } = context.ids.value;
                    context.ids.value = rest;
                });
            },
            { immediate: true },
        );

        watch(
            input,
            (element, _, onCleanup) => {
                if (element === null) {
                    return;
                }
                onCleanup(
                    bridgeForm(element, {
                        reset: () => {
                            if (inGroup.value) {
                                group?.reset();
                                return;
                            }
                            own.set(props.defaultChecked, { reason: "none" });
                            element.checked = props.defaultChecked;
                        },
                        invalid: () => button.value,
                    }),
                );
            },
            { flush: "post" },
        );

        const toggle = () => {
            const current = state.value;
            if (current.disabled) {
                return;
            }
            const next = current.indeterminate ? true : !current.checked;
            if (group === null || !inGroup.value) {
                own.set(next, { reason: "none" });
            } else if (props.parent) {
                group.setAll(next);
            } else {
                group.toggle(props.value as string, next);
            }
        };

        return () => {
            const current = state.value;
            const controls =
                group !== null && inGroup.value && props.parent
                    ? group
                          .allValues()
                          .map((entry) => group.ids.value[entry])
                          .filter((entry) => entry !== undefined)
                          .join(" ") || undefined
                    : undefined;
            return h(Fragment, [
                renderPart("button", { attrs, slots }, props.as, current, {
                    type: "button",
                    role: "checkbox",
                    id: id.value,
                    disabled: current.disabled,
                    "aria-checked": current.indeterminate
                        ? "mixed"
                        : current.checked
                          ? "true"
                          : "false",
                    "aria-required": current.required ? "true" : undefined,
                    "aria-controls": controls,
                    "data-checkbox-part": "root",
                    ...stateAttributes({
                        ...checkedAttributes(current),
                        required: current.required,
                    }),
                    onClick: toggle,
                    onKeydown: (event: KeyboardEvent) => {
                        // APG: Space toggles, Enter does not (a button would click on Enter)
                        if (event.key === "Enter") {
                            event.preventDefault();
                        }
                    },
                    ref: setButton,
                }),
                h("input", {
                    ref: (element: unknown) => {
                        input.value = element as HTMLInputElement | null;
                    },
                    type: "checkbox",
                    "aria-hidden": "true",
                    tabindex: -1,
                    name: props.parent ? undefined : props.name,
                    value: props.value ?? "on",
                    checked:
                        current.checked && !(props.parent && inGroup.value),
                    required: current.required,
                    disabled: current.disabled,
                    style: VISUALLY_HIDDEN_INPUT_STYLE,
                    "data-checkbox-part": "input",
                }),
            ]);
        };
    },
});
