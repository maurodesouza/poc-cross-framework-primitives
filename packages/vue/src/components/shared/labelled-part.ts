import {
    defineComponent,
    type InjectionKey,
    onBeforeUnmount,
    onMounted,
    type Ref,
    useId,
} from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";

/**
 * A title or description: registers its id with its root (the popup's `aria-labelledby` /
 * `aria-describedby`).
 */
export function defineLabelledPart<Context extends object>(
    name: string,
    key: InjectionKey<Context>,
    tag: string,
    partAttribute: string,
    partName: string,
    idOf: (context: Context) => Ref<string | undefined>,
) {
    return defineComponent({
        name,
        inheritAttrs: false,
        props: asProp,
        setup(props, { attrs, slots }) {
            const context = useRequiredContext(key, name);
            const generated = useId();
            const id = () => (attrs.id as string | undefined) ?? generated;
            onMounted(() => {
                idOf(context).value = id();
            });
            onBeforeUnmount(() => {
                idOf(context).value = undefined;
            });
            return () =>
                renderPart(
                    tag,
                    { attrs, slots },
                    props.as,
                    {},
                    { id: id(), [partAttribute]: partName },
                );
        },
    });
}

/** A Close part: closes its overlay (reason `close-press`). */
export function defineClosePart<
    Context extends { setOpen: (open: boolean, reason: "close-press") => void },
>(name: string, key: InjectionKey<Context>, partAttribute: string) {
    return defineComponent({
        name,
        inheritAttrs: false,
        props: asProp,
        setup(props, { attrs, slots }) {
            const context = useRequiredContext(key, name);
            return () =>
                renderPart(
                    "button",
                    { attrs, slots },
                    props.as,
                    {},
                    {
                        type: "button",
                        [partAttribute]: "close",
                        onClick: () => context.setOpen(false, "close-press"),
                    },
                );
        },
    });
}
