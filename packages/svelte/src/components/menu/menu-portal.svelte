<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { MenuContext } from "./menu-context.svelte.ts";

let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = MenuContext.use("Menu.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
