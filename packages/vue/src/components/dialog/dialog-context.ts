import type { InjectionKey, Ref, ShallowRef } from "vue";
import type { OverlayRoot } from "../../composables/use-overlay-root.ts";

export interface DialogContext extends OverlayRoot {
    backdrop: ShallowRef<HTMLElement | null>;
    titleId: Ref<string | undefined>;
    descriptionId: Ref<string | undefined>;
}

export const DialogKey: InjectionKey<DialogContext> = Symbol("Dialog");
