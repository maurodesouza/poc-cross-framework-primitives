import {
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    inject,
    input,
} from "@angular/core";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { menuItemBehaviour } from "./menu-item-behaviour.ts";
import { MenuRoot } from "./menu-root.directive.ts";

export interface MenuItemState {
    highlighted: boolean;
    disabled: boolean;
}

/**
 * An action: `<div menuItem (click)="...">`. Enter, Space and clicks fire its `click`, then close
 * every level (spec/menu.md). A disabled item stays focusable but is never activated: a capturing
 * listener on the item stops the click before the consumer's own `(click)`.
 */
@Directive({
    selector: "[menuItem]",
    exportAs: "menuItem",
    host: {
        role: "menuitem",
        tabindex: "-1",
        "data-menu-part": "item",
        "[attr.aria-disabled]": "state().disabled ? 'true' : null",
        "[attr.data-highlighted]": "data().highlighted",
        "[attr.data-disabled]": "data().disabled",
        "(focus)": "item.onFocus()",
        "(blur)": "item.onBlur()",
        "(pointermove)": "item.onPointerMove($event)",
        "(pointerleave)": "item.onPointerLeave()",
        "(click)": "onClick()",
    },
})
export class MenuItem {
    private readonly level = inject(MenuRoot);
    readonly disabled = input(false, { transform: booleanAttribute });
    /** The text typeahead matches (default: the item's text). */
    readonly label = input<string | undefined>(undefined);
    /** Activating the item closes every menu level (default `true`). */
    readonly closeOnClick = input(true, { transform: booleanAttribute });
    protected readonly item = menuItemBehaviour(
        this.level,
        injectHost(),
        this.label,
        false,
    );
    readonly state = computed<MenuItemState>(() => ({
        highlighted: this.item.highlighted(),
        disabled: this.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const host = injectHost();
        const stopDisabled = (event: Event) => {
            if (this.disabled()) {
                event.stopImmediatePropagation();
            }
        };
        // at the target, capturing listeners run before the consumer's `(click)`
        host.addEventListener("click", stopDisabled, { capture: true });
        inject(DestroyRef).onDestroy(() =>
            host.removeEventListener("click", stopDisabled, { capture: true }),
        );
    }

    protected onClick(): void {
        if (!this.disabled() && this.closeOnClick()) {
            this.level.closeAll("item-press");
        }
    }
}
