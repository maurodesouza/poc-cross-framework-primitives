import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { ComboboxKey } from "./combobox-context.ts";

/**
 * Renders the value: its label (labels joined with ", "), or the default scoped slot
 * (`v-slot="{ value }"`: an item or `null`, or the list of items).
 */
export const ComboboxValue = defineComponent({
    name: "ComboboxValue",
    setup(_, { slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Value");
        return () =>
            slots.default?.({ value: context.value.value }) ??
            context.values.value.map(context.label).join(", ");
    },
});
