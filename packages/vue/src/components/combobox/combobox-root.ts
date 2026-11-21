import {
    type Align,
    bridgeForm,
    containsFilter,
    filterItems,
    type ItemEquality,
    type ItemFilter,
    type ItemGroup,
    includesItem,
    itemFormValue,
    itemLabel,
    queryIsLabel,
    type Side,
    toggleItem,
    VISUALLY_HIDDEN_INPUT_STYLE,
} from "@poc/dom";
import {
    computed,
    defineComponent,
    Fragment,
    h,
    nextTick,
    type PropType,
    provide,
    ref,
    shallowRef,
    toRaw,
    useId,
    watch,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import { useFieldControl } from "../../composables/use-field-control.ts";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import {
    type ComboboxContext,
    type ComboboxItemInfo,
    ComboboxKey,
} from "./combobox-context.ts";

const NONE: readonly unknown[] = [];

/**
 * Holds the combobox's state (`v-model:value`, `v-model:input-value`, `v-model:open`); renders
 * its hidden form inputs (spec/combobox.md).
 */
export const ComboboxRoot = defineComponent({
    name: "ComboboxRoot",
    props: {
        ...overlayRootProps,
        /** The items, or groups of items: the combobox filters them (spec/combobox.md). */
        items: {
            type: Array as PropType<readonly (unknown | ItemGroup<unknown>)[]>,
            default: undefined,
        },
        /** Whether an item matches the query; `null` turns filtering off. */
        filter: {
            type: Function as PropType<ItemFilter<unknown> | null>,
            default: undefined,
        },
        /** The most items the list renders; `-1` for no limit. */
        limit: { type: Number, default: -1 },
        locale: { type: String, default: undefined },
        multiple: { type: Boolean, default: false },
        /** The selected item (or `null`), or the selected items with `multiple`. */
        value: { type: null, default: undefined },
        defaultValue: {
            type: null,
            default: undefined,
        },
        inputValue: { type: String, default: undefined },
        defaultInputValue: { type: String, default: undefined },
        isItemEqualToValue: {
            type: Function as PropType<ItemEquality<unknown>>,
            default: undefined,
        },
        itemToStringLabel: {
            type: Function as PropType<(item: unknown) => string>,
            default: undefined,
        },
        itemToStringValue: {
            type: Function as PropType<(item: unknown) => string>,
            default: undefined,
        },
        name: { type: String, default: undefined },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    },
    emits: {
        ...overlayRootEmits,
        "update:value": (_value: unknown) => true,
        valueChange: (_value: unknown, _details: ChangeDetails) => true,
        "update:inputValue": (_value: string) => true,
        inputValueChange: (_value: string, _details: ChangeDetails) => true,
    },
    setup(props, { emit, slots }) {
        const root = useOverlayRoot(props, emit);
        const multiple = () => props.multiple;
        const defaultValue: unknown =
            props.defaultValue ?? (props.multiple ? NONE : null);
        const label = (item: unknown) =>
            itemLabel(item, props.itemToStringLabel);
        const formValue = (item: unknown) =>
            itemFormValue(item, props.itemToStringValue);
        const valueState = useControllable<unknown, ChangeDetails>(
            () => props.value,
            defaultValue,
            (next, details) => {
                emit("update:value", next);
                emit("valueChange", next, details);
            },
        );
        const value = computed(() => valueState.value.value);
        const values = computed<readonly unknown[]>(() => {
            const current = value.value;
            if (props.multiple) {
                return (current as readonly unknown[] | null) ?? NONE;
            }
            return current === null || current === undefined ? NONE : [current];
        });
        const inputState = useControllable<string, ChangeDetails>(
            () => props.inputValue,
            props.defaultInputValue ??
                (props.multiple ? "" : label(props.value ?? defaultValue)),
            (next, details) => {
                emit("update:inputValue", next);
                emit("inputValueChange", next, details);
            },
        );
        const inputValue = computed(() => inputState.value.value);

        const hidden = shallowRef<HTMLInputElement | null>(null);
        const field = useFieldControl({
            // the input's rendered id: the consumer's, else the generated one
            id: () => root.trigger.value?.id || root.triggerId,
            labelable: true,
            value: () => value.value,
            filled: () => values.value.length > 0,
            input: () => hidden.value,
        });
        const disabled = () => props.disabled || field.disabled();
        const highlighted = ref<string | null>(null);
        const typed = ref(false);
        const pendingHighlight: ComboboxContext["pendingHighlight"] = {
            current: null,
        };

        const setOpen = (next: boolean, reason: ChangeReason) => {
            if (!next || reason !== "input-change") {
                typed.value = false;
            }
            if (!next) {
                pendingHighlight.current = null;
            }
            root.setOpen(next, reason);
            if (next || reason === "item-press") {
                return;
            }
            // closing without a choice resets the text (spec/combobox.md, "Choosing an item")
            const text = props.multiple ? "" : label(value.value);
            if (inputValue.value !== text) {
                inputState.set(text, {
                    reason: text === "" ? "input-clear" : "none",
                });
            }
        };
        // a value held in the consumer's `ref` is its reactive proxy: compare the raw objects
        const isEqual = (item: unknown, other: unknown) =>
            props.isItemEqualToValue
                ? props.isItemEqualToValue(item, other)
                : Object.is(toRaw(item), toRaw(other));

        const filter = computed<ItemFilter<unknown> | null>(() =>
            props.filter === undefined
                ? containsFilter<unknown>(props.locale)
                : props.filter,
        );
        const entries = computed<readonly unknown[]>(() => {
            const items = props.items;
            if (items === undefined) {
                return NONE;
            }
            const query = inputValue.value.trim();
            // a single combobox that opened on its selected item's label shows every item
            const whole =
                !props.multiple &&
                !typed.value &&
                values.value.length > 0 &&
                queryIsLabel(label(values.value[0]), query, props.locale);
            return filterItems(items, whole ? "" : query, {
                filter: filter.value,
                limit: props.limit,
                itemToString: label,
            });
        });

        const context: ComboboxContext = {
            ...root,
            setOpen,
            field,
            multiple,
            value,
            values,
            inputValue,
            setInputValue: (next, reason) => inputState.set(next, { reason }),
            disabled,
            highlighted,
            isSelected: (item) => includesItem(values.value, item, isEqual),
            choose(item) {
                highlighted.value = null;
                if (!props.multiple) {
                    valueState.set(item, { reason: "item-press" });
                    inputState.set(label(item), { reason: "item-press" });
                    setOpen(false, "item-press");
                    return;
                }
                valueState.set(toggleItem(values.value, item, isEqual), {
                    reason: "item-press",
                });
                if (inputValue.value.trim() !== "") {
                    inputState.set("", { reason: "input-clear" });
                    setOpen(false, "item-press");
                }
            },
            clear(reason) {
                inputState.set("", { reason });
                valueState.set(props.multiple ? [] : null, { reason });
                highlighted.value = null;
            },
            removeAt(index, reason) {
                valueState.set(
                    values.value.filter((_, at) => at !== index),
                    { reason },
                );
            },
            label,
            hasItems: () => props.items !== undefined,
            entries,
            markTyped: () => {
                typed.value = true;
            },
            items: new Map<HTMLElement, ComboboxItemInfo>(),
            list: shallowRef(null),
            button: shallowRef(null),
            inputGroup: shallowRef(null),
            chips: shallowRef(null),
            clearButton: shallowRef(null),
            listId: `${useId()}-list`,
            pendingHighlight,
            placed: ref<{ side: Side; align: Align }>({
                side: "bottom",
                align: "start",
            }),
            itemCount: ref(0),
        };
        provide(ComboboxKey, context);

        watch(
            hidden,
            (element, _, onCleanup) => {
                if (element === null) {
                    return;
                }
                onCleanup(
                    bridgeForm(element, {
                        reset: () => {
                            valueState.set(defaultValue, { reason: "none" });
                            inputState.set(
                                props.multiple ? "" : label(defaultValue),
                                { reason: "none" },
                            );
                            // the browser reset the elements: write the state back once rendered
                            void nextTick().then(() => {
                                const input = root.trigger.value;
                                if (
                                    input instanceof HTMLInputElement &&
                                    input.value !== inputValue.value
                                ) {
                                    input.value = inputValue.value;
                                }
                                if (!props.multiple) {
                                    element.value = formValue(value.value);
                                }
                            });
                        },
                        invalid: () => root.trigger.value,
                    }),
                );
            },
            { flush: "post" },
        );

        return () => {
            const fieldName = field.name() ?? props.name;
            const isMultiple = props.multiple;
            const count = values.value.length;
            return h(Fragment, [
                slots.default?.(),
                h("input", {
                    ref: (element: unknown) => {
                        hidden.value = element as HTMLInputElement | null;
                    },
                    "aria-hidden": "true",
                    tabindex: -1,
                    name: isMultiple ? undefined : fieldName,
                    value: isMultiple ? "" : formValue(value.value),
                    required: isMultiple
                        ? props.required && count === 0
                        : props.required,
                    disabled: disabled(),
                    style: VISUALLY_HIDDEN_INPUT_STYLE,
                    "data-combobox-part": "hidden-input",
                }),
                ...(isMultiple && fieldName !== undefined
                    ? values.value.map((item) =>
                          h("input", {
                              key: formValue(item),
                              type: "hidden",
                              name: fieldName,
                              value: formValue(item),
                              disabled: disabled(),
                              "data-combobox-part": "hidden-input",
                          }),
                      )
                    : []),
            ]);
        };
    },
});
