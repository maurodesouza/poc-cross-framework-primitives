<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { PopoverContext } from "./popover-context.svelte.ts";

let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = PopoverContext.use("Popover.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
