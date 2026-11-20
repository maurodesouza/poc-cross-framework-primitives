import type { ChangeDetails } from "@poc/vue";
import { reactive, ref } from "vue";

/** The open state, last reason and last clicked item a menu scenario prints. */
export function useMenuOutput() {
    const open = ref(false);
    const values = reactive<{
        open: boolean;
        reason?: string;
        action?: string;
    }>({ open: false });
    return {
        open,
        values,
        onOpenChange: (next: boolean, details: ChangeDetails) => {
            values.open = next;
            values.reason = details.reason;
        },
        select: (label: string) => () => {
            values.action = label;
        },
    };
}
