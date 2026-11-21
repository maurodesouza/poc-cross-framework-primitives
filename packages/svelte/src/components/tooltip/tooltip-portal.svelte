<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { TooltipContext } from "./tooltip-context.svelte.ts";

let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = TooltipContext.use("Tooltip.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
