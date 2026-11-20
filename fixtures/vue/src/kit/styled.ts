import { type Component, defineComponent, h, mergeProps } from "vue";

/**
 * A primitive dressed with its recipe: the styled layer (a per-framework Fragiola UI in
 * miniature). Attributes, listeners and slots pass through. A stateful component, not a
 * functional one, so a template ref on it gives an instance whose `$el` is the part's element.
 */
export function styled(component: Component, className: string) {
    return defineComponent({
        name: "Styled",
        inheritAttrs: false,
        setup(_, { attrs, slots }) {
            return () =>
                h(component, mergeProps({ class: className }, attrs), slots);
        },
    });
}
