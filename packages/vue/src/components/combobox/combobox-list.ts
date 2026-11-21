import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxKey, isEmpty, orderedItems } from "./combobox-context.ts";

/**
 * The `listbox`. With the Root's `items`, its default scoped slot renders each matching entry
 * (`v-slot="{ entry, index }"`: an item, or a group); without them, its content as is. Applies
 * the highlight the keyboard asked for once its items render.
 */
export const ComboboxList = defineComponent({
    name: "ComboboxList",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.List");
        const setList = elementSetter(context.list);
        watch(
            () => [context.list.value, context.itemCount.value] as const,
            ([list]) => {
                const pending = context.pendingHighlight.current;
                if (list === null || pending === null) {
                    return;
                }
                const items = orderedItems(context);
                // the items register after the list renders them: wait for every one
                if (
                    items.length <
                    list.querySelectorAll('[role="option"]').length
                ) {
                    return;
                }
                context.pendingHighlight.current = null;
                const selected = context.multiple()
                    ? undefined
                    : items.find((item) => context.isSelected(item.value));
                const edge = pending === "first" ? items[0] : items.at(-1);
                const target =
                    selected ?? (pending === "selected" ? undefined : edge);
                context.highlighted.value = target?.id ?? null;
            },
            { flush: "post", immediate: true },
        );
        return () => {
            const empty = isEmpty(context);
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { empty },
                {
                    role: "listbox",
                    id: context.listId,
                    "aria-multiselectable": context.multiple()
                        ? "true"
                        : undefined,
                    "data-combobox-part": "list",
                    ...stateAttributes({ empty }),
                    ref: setList,
                },
                () =>
                    context.hasItems()
                        ? context.entries.value.flatMap(
                              (entry, index) =>
                                  slots.default?.({ entry, index }) ?? [],
                          )
                        : slots.default?.({ state: { empty } }),
            );
        };
    },
});
