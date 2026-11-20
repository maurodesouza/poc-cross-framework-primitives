import type { Align, Side } from "@poc/dom";
import type { InjectionKey, Ref, ShallowRef } from "vue";
import type { OverlayRoot } from "../../composables/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

export interface ComboboxItemInfo {
    value: string;
    label: string;
    disabled: boolean;
    id: string;
}

export interface ComboboxContext extends OverlayRoot {
    value: Ref<string | null>;
    inputValue: Ref<string>;
    setInputValue: (value: string, reason: ChangeReason) => void;
    disabled: () => boolean;
    highlighted: Ref<string | null>;
    choose: (value: string) => void;
    clear: () => void;
    items: Map<HTMLElement, ComboboxItemInfo>;
    list: ShallowRef<HTMLElement | null>;
    /** The Trigger button (the overlay root's `trigger` is the input, the list's anchor). */
    button: ShallowRef<HTMLElement | null>;
    listId: string;
    pendingHighlight: { current: "first" | "last" | null };
    placed: Ref<{ side: Side; align: Align }>;
    itemCount: Ref<number>;
}

export const ComboboxKey: InjectionKey<ComboboxContext> = Symbol("Combobox");

/** The rendered items of the list, in order. */
export function orderedItems(context: ComboboxContext): ComboboxItemInfo[] {
    const list = context.list.value;
    if (list === null) {
        return [];
    }
    return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
        .map((element) => context.items.get(element))
        .filter((item): item is ComboboxItemInfo => item !== undefined);
}
