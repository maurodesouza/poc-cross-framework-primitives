import { computed, signal } from "@angular/core";
import type { OpenChangeEvent } from "@poc/angular";

/** The open state, last reason and last clicked item a menu scenario prints. */
export class MenuOutput {
    readonly open = signal(false);
    private readonly reason = signal<string | undefined>(undefined);
    private readonly action = signal<string | undefined>(undefined);
    readonly values = computed(() => ({
        open: this.open(),
        reason: this.reason(),
        action: this.action(),
    }));

    onOpenChange(event: OpenChangeEvent): void {
        this.reason.set(event.details.reason);
    }

    select(label: string): void {
        this.action.set(label);
    }
}
