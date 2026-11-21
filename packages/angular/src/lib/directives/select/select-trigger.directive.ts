import { afterNextRender, computed, Directive, inject } from "@angular/core";
import { createTypeahead, menuKeyTarget } from "@poc/dom";
import { writeFieldAria } from "../../utils/field-control.ts";
import { injectFlush } from "../../utils/flush.ts";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { initialHighlight, SelectRoot } from "./select-root.directive.ts";

export interface SelectTriggerState {
    open: boolean;
    disabled: boolean;
    placeholder: boolean;
}

// Within this time after a typed character, Space continues the typeahead instead of choosing.
const TYPEAHEAD_SPACE = 500;

/**
 * The select-only `combobox`: `<button selectTrigger>`. It keeps DOM focus while the list is
 * open; the highlighted item is announced with `aria-activedescendant` (spec/select.md,
 * "Keyboard").
 */
@Directive({
    selector: "[selectTrigger]",
    exportAs: "selectTrigger",
    host: {
        type: "button",
        role: "combobox",
        "aria-haspopup": "listbox",
        "data-select-part": "trigger",
        "[attr.disabled]": "data().disabled",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "state().open ? root.listId : null",
        "[attr.aria-activedescendant]": "activeId()",
        "[attr.aria-required]": "root.required() ? 'true' : null",
        "[attr.data-invalid]": "root.field.data().invalid",
        "[attr.data-valid]": "root.field.data().valid",
        "[attr.data-dirty]": "root.field.data().dirty",
        "[attr.data-touched]": "root.field.data().touched",
        "[attr.data-filled]": "root.field.data().filled",
        "[attr.data-focused]": "root.field.data().focused",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-placeholder]": "data().placeholder",
        "(click)": "onClick()",
        "(keydown)": "onKeyDown($event)",
        "(focus)": "root.field.focused()",
        "(blur)": "root.field.blurred()",
    },
})
export class SelectTrigger {
    protected readonly root = inject(SelectRoot);
    readonly state = computed<SelectTriggerState>(() => ({
        open: this.root.overlay.open(),
        disabled: this.root.isDisabled(),
        placeholder: this.root.selected() === null,
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly activeId = computed(() => {
        const highlighted = this.root.highlighted();
        return this.state().open && highlighted !== null
            ? this.root.itemId(highlighted)
            : null;
    });
    protected readonly String = String;
    private readonly typeahead = createTypeahead();
    private lastTyped = 0;
    private readonly flush = injectFlush();

    constructor() {
        const host = registerHost(this.root.overlay.trigger);
        const { field } = this.root;
        writeFieldAria(field, host, {
            "aria-labelledby": field.labelledBy,
            "aria-describedby": field.describedBy,
            "aria-invalid": field.ariaInvalid,
        });
        // the consumer's own id wins (the label's `for` points at it)
        afterNextRender(() => {
            if (host.id === "") {
                host.id = this.root.overlay.triggerId;
            }
            this.root.triggerElementId.set(host.id);
        });
    }

    protected onClick(): void {
        const root = this.root;
        if (root.overlay.open()) {
            root.overlay.setOpen(false, "trigger-press");
        } else {
            root.openOn(
                initialHighlight(root.items(), root.selected()),
                "trigger-press",
            );
        }
    }

    private highlight(value: string): void {
        this.root.highlighted.set(value);
        // the highlight (and its scroll into view) before the next key
        this.flush();
    }

    private typeTo(key: string): void {
        const root = this.root;
        const items = root.items();
        const open = root.overlay.open();
        const from = items.findIndex(
            (item) =>
                item.value === (open ? root.highlighted() : root.selected()),
        );
        const match = this.typeahead.match(
            key,
            items.map((item) => item.label),
            from,
        );
        this.lastTyped = Date.now();
        const target = items[match]?.value;
        if (target === undefined) {
            return;
        }
        if (open) {
            this.highlight(target);
        } else {
            root.openOn(target, "list-navigation");
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const root = this.root;
        if (root.isDisabled()) {
            return;
        }
        const items = root.items();
        const open = root.overlay.open();
        const highlighted = root.highlighted();
        const typing =
            event.key === " " && Date.now() - this.lastTyped < TYPEAHEAD_SPACE;
        if ((event.key.length === 1 && event.key !== " ") || typing) {
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }
            event.preventDefault();
            this.typeTo(event.key);
            return;
        }
        if (!open) {
            switch (event.key) {
                case "ArrowDown":
                case "ArrowUp":
                case "Enter":
                case " ":
                    event.preventDefault();
                    root.openOn(
                        initialHighlight(items, root.selected()),
                        "list-navigation",
                    );
                    return;
                case "Home":
                case "End":
                    event.preventDefault();
                    root.openOn(
                        (event.key === "Home" ? items[0] : items.at(-1))
                            ?.value ?? null,
                        "list-navigation",
                    );
                    return;
                default:
                    return;
            }
        }
        const index = items.findIndex((item) => item.value === highlighted);
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
            case "Home":
            case "End": {
                event.preventDefault();
                const next = menuKeyTarget(event.key, index, items.length, {
                    loop: false,
                });
                const target = next === null ? undefined : items[next];
                if (target !== undefined) {
                    this.highlight(target.value);
                }
                return;
            }
            case "Enter":
            case " ":
                event.preventDefault();
                if (highlighted !== null) {
                    root.choose(highlighted, "item-press");
                }
                return;
            case "Tab": {
                // APG: Tab chooses the highlighted option, then focus moves on
                const item = items[index];
                if (item !== undefined && !item.disabled) {
                    root.choose(item.value, "focus-out");
                } else {
                    root.overlay.setOpen(false, "focus-out");
                }
                return;
            }
            default:
        }
    }
}
