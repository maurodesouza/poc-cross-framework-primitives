import type { ChangeDetails } from "@poc/svelte";

/** The open state, last reason and last clicked item a menu scenario prints. */
export class MenuOutput {
    open = $state(false);
    reason = $state<string>();
    action = $state<string>();

    onOpenChange = (_: boolean, details: ChangeDetails) => {
        this.reason = details.reason;
    };

    select = (label: string) => () => {
        this.action = label;
    };
}
