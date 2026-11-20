import {
    computed,
    defineComponent,
    type PropType,
    provide,
    ref,
    shallowRef,
    useId,
    watch,
} from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { type TabInfo, TabsKey } from "./tabs-context.ts";

/** spec/tabs.md (`v-model:value`) */
export const TabsRoot = defineComponent({
    name: "TabsRoot",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: { type: String, default: undefined },
        /** Default: the first enabled tab. */
        defaultValue: { type: String, default: undefined },
        orientation: {
            type: String as PropType<"horizontal" | "vertical">,
            default: "horizontal",
        },
        /** `automatic`: moving focus selects; `manual`: Enter or Space selects. */
        activation: {
            type: String as PropType<"automatic" | "manual">,
            default: "automatic",
        },
        loop: { type: Boolean, default: true },
    },
    emits: {
        "update:value": (_value: string) => true,
        valueChange: (_value: string, _details: ChangeDetails) => true,
    },
    setup(props, { attrs, slots, emit }) {
        const state = useControllable<string | undefined, ChangeDetails>(
            () => props.value,
            props.defaultValue,
            (next, details) => {
                if (next !== undefined) {
                    emit("update:value", next);
                    emit("valueChange", next, details);
                }
            },
        );
        const tabs = new Map<HTMLElement, TabInfo>();
        const list = shallowRef<HTMLElement | null>(null);
        const version = ref(0);
        const value = computed(() => state.value.value);
        provide(TabsKey, {
            value,
            select: (next, reason) => state.set(next, { reason }),
            orientation: () => props.orientation,
            activation: () => props.activation,
            loop: () => props.loop,
            baseId: useId(),
            tabs,
            list,
            version,
        });
        // no value: the first enabled tab, once the tabs are known
        watch(
            () => [value.value, list.value, version.value] as const,
            ([current, listElement]) => {
                if (current !== undefined || listElement === null) {
                    return;
                }
                const first = [
                    ...listElement.querySelectorAll<HTMLElement>(
                        '[role="tab"]',
                    ),
                ]
                    .map((element) => tabs.get(element))
                    .find((info) => info !== undefined && !info.disabled);
                if (first) {
                    state.set(first.value, { reason: "none" });
                }
            },
            { flush: "post", immediate: true },
        );
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {
                    orientation: props.orientation,
                    activation: props.activation,
                },
                {
                    "data-tabs-part": "root",
                    ...stateAttributes({
                        orientation: props.orientation,
                        activation: props.activation,
                    }),
                },
            );
    },
});
