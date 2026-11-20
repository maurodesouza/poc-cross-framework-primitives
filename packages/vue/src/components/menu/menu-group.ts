import {
    defineComponent,
    type InjectionKey,
    provide,
    type Ref,
    ref,
} from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";

export const MenuGroupKey: InjectionKey<Ref<string | undefined>> =
    Symbol("MenuGroup");

/** Groups items under its GroupLabel. */
export const MenuGroup = defineComponent({
    name: "MenuGroup",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const labelId = ref<string>();
        provide(MenuGroupKey, labelId);
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                {
                    role: "group",
                    "aria-labelledby": labelId.value,
                    "data-menu-part": "group",
                },
            );
    },
});
