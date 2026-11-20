import {
    defineComponent,
    inject,
    onBeforeUnmount,
    onMounted,
    useId,
} from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { MenuGroupKey } from "./menu-group.ts";

/** Names its Group. */
export const MenuGroupLabel = defineComponent({
    name: "MenuGroupLabel",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const labelId = inject(MenuGroupKey, null);
        const generated = useId();
        const id = () => (attrs.id as string | undefined) ?? generated;
        onMounted(() => {
            if (labelId) {
                labelId.value = id();
            }
        });
        onBeforeUnmount(() => {
            if (labelId) {
                labelId.value = undefined;
            }
        });
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                { id: id(), "data-menu-part": "group-label" },
            );
    },
});
