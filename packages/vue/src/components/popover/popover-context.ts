import type { Align, Side } from "@poc/dom";
import type { InjectionKey, Ref, ShallowRef } from "vue";
import type { OverlayRoot } from "../../composables/use-overlay-root.ts";

export interface PopoverContext extends OverlayRoot {
    arrow: ShallowRef<HTMLElement | null>;
    placed: Ref<{ side: Side; align: Align }>;
    titleId: Ref<string | undefined>;
    descriptionId: Ref<string | undefined>;
}

export const PopoverKey: InjectionKey<PopoverContext> = Symbol("Popover");
