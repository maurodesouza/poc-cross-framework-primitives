<script lang="ts">
import type { Snippet } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import MenuRoot from "./menu-root.svelte";

/** A nested menu level; its trigger is a `SubmenuTrigger` item of the parent menu. */
let {
    open = $bindable(),
    ...rest
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    loop?: boolean;
    children?: Snippet;
} = $props();
</script>

<MenuRoot bind:open nested {...rest} />
