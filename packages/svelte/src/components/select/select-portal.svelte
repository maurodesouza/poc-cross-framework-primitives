<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { SelectContext } from "./select-context.svelte.ts";

let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = SelectContext.use("Select.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
