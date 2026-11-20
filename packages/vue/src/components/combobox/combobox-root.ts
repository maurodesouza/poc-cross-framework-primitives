import type { Align, Side } from "@poc/dom";
import {
    computed,
    defineComponent,
    type PropType,
    provide,
    ref,
    shallowRef,
    useId,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type ComboboxItemInfo, ComboboxKey } from "./combobox-context.ts";

/** Holds the combobox's state (`v-model:value`, `v-model:input-value`, `v-model:open`). */
export const ComboboxRoot = defineComponent({
    name: "ComboboxRoot",
    props: {
        ...overlayRootProps,
        value: { type: String as PropType<string | null>, default: undefined },
        defaultValue: {
            type: String as PropType<string | null>,
            default: null,
        },
        inputValue: { type: String, default: undefined },
        defaultInputValue: { type: String, default: "" },
        disabled: { type: Boolean, default: false },
    },
    emits: {
        ...overlayRootEmits,
        "update:value": (_value: string | null) => true,
        valueChange: (_value: string | null, _details: ChangeDetails) => true,
        "update:inputValue": (_value: string) => true,
        inputValueChange: (_value: string, _details: ChangeDetails) => true,
    },
    setup(props, { emit, slots }) {
        const root = useOverlayRoot(props, emit);
        const value = useControllable<string | null, ChangeDetails>(
            () => props.value,
            props.defaultValue,
            (next, details) => {
                emit("update:value", next);
                emit("valueChange", next, details);
            },
        );
        const inputValue = useControllable<string, ChangeDetails>(
            () => props.inputValue,
            props.defaultInputValue,
            (next, details) => {
                emit("update:inputValue", next);
                emit("inputValueChange", next, details);
            },
        );
        const highlighted = ref<string | null>(null);
        const items = new Map<HTMLElement, ComboboxItemInfo>();
        provide(ComboboxKey, {
            ...root,
            value: computed(() => value.value.value),
            inputValue: computed(() => inputValue.value.value),
            setInputValue: (next, reason) => inputValue.set(next, { reason }),
            disabled: () => props.disabled,
            highlighted,
            choose(next) {
                const item = [...items.values()].find(
                    (candidate) => candidate.value === next,
                );
                if (item === undefined || item.disabled) {
                    return;
                }
                value.set(next, { reason: "item-press" });
                inputValue.set(item.label, { reason: "item-press" });
                highlighted.value = null;
                root.setOpen(false, "item-press");
            },
            clear() {
                inputValue.set("", { reason: "escape-key" });
                value.set(null, { reason: "escape-key" });
            },
            items,
            list: shallowRef(null),
            button: shallowRef(null),
            listId: `${useId()}-list`,
            pendingHighlight: { current: null },
            placed: ref<{ side: Side; align: Align }>({
                side: "bottom",
                align: "start",
            }),
            itemCount: ref(0),
        });
        return () => slots.default?.();
    },
});
