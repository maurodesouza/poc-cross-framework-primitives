import {
    type Align,
    bridgeForm,
    type Side,
    VISUALLY_HIDDEN_INPUT_STYLE,
} from "@poc/dom";
import {
    computed,
    defineComponent,
    Fragment,
    h,
    type PropType,
    provide,
    ref,
    shallowRef,
    useId,
    watch,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type SelectItemData, SelectKey } from "./select-context.ts";

/** Holds the select's state (`v-model:value`, `v-model:open`); renders its hidden input (spec/select.md). */
export const SelectRoot = defineComponent({
    name: "SelectRoot",
    props: {
        ...overlayRootProps,
        value: { type: String as PropType<string | null>, default: undefined },
        defaultValue: {
            type: String as PropType<string | null>,
            default: null,
        },
        /** Every item: the Root needs their labels while the list is closed. */
        items: {
            type: Array as PropType<readonly SelectItemData[]>,
            required: true,
        },
        name: { type: String, default: undefined },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    },
    emits: {
        ...overlayRootEmits,
        "update:value": (_value: string | null) => true,
        valueChange: (_value: string | null, _details: ChangeDetails) => true,
    },
    setup(props, { emit, slots }) {
        const root = useOverlayRoot(props, emit);
        const state = useControllable<string | null, ChangeDetails>(
            () => props.value,
            props.defaultValue,
            (next, details) => {
                emit("update:value", next);
                emit("valueChange", next, details);
            },
        );
        const value = computed(() => state.value.value);
        const highlighted = ref<string | null>(null);
        const baseId = useId();
        const listId = `${baseId}-list`;
        provide(SelectKey, {
            ...root,
            items: () => props.items,
            value,
            disabled: () => props.disabled,
            required: () => props.required,
            highlighted,
            openOn(entry, reason) {
                highlighted.value = entry;
                root.setOpen(true, reason);
            },
            choose(entry, reason) {
                const item = props.items.find(
                    (candidate) => candidate.value === entry,
                );
                if (item === undefined || item.disabled) {
                    return;
                }
                state.set(entry, { reason });
                root.setOpen(false, reason);
            },
            listId,
            itemId: (entry) =>
                `${baseId}-item-${props.items.findIndex((item) => item.value === entry)}`,
            placed: ref<{ side: Side; align: Align }>({
                side: "bottom",
                align: "start",
            }),
        });

        const input = shallowRef<HTMLInputElement | null>(null);
        watch(
            input,
            (element, _, onCleanup) => {
                if (element === null) {
                    return;
                }
                onCleanup(
                    bridgeForm(element, {
                        reset: () => {
                            state.set(props.defaultValue, { reason: "none" });
                            element.value = props.defaultValue ?? "";
                        },
                        invalid: () => root.trigger.value,
                    }),
                );
            },
            { flush: "post" },
        );
        return () =>
            h(Fragment, [
                slots.default?.(),
                h("input", {
                    ref: (element: unknown) => {
                        input.value = element as HTMLInputElement | null;
                    },
                    "aria-hidden": "true",
                    tabindex: -1,
                    name: props.name,
                    value: value.value ?? "",
                    required: props.required,
                    disabled: props.disabled,
                    style: VISUALLY_HIDDEN_INPUT_STYLE,
                    "data-select-part": "input",
                }),
            ]);
    },
});
