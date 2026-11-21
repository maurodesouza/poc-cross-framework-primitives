<script lang="ts">
import type { Snippet } from "svelte";
import Portal from "../shared/portal.svelte";
import { ComboboxContext } from "./combobox-context.svelte.ts";

let { container, children }: { container?: Element | null; children: Snippet } =
    $props();
const context = ComboboxContext.use("Combobox.Portal");
</script>

<Portal mounted={context.presence.mounted} {container} {children} />
