<script lang="ts">
import { tooltip } from "@poc/styles";
import { Tooltip } from "@poc/svelte";

const TOOLS = [
    { label: "Bold", hint: "Bold (Ctrl+B)" },
    { label: "Italic", hint: "Italic (Ctrl+I)" },
    { label: "Underline", hint: "Underline (Ctrl+U)" },
];
</script>

<Tooltip.Provider delay={800} timeout={400}><div class="flex gap-2">{#each TOOLS as tool (tool.label)}<Tooltip.Root><Tooltip.Trigger class={tooltip.trigger}>{tool.label}</Tooltip.Trigger><Tooltip.Portal><Tooltip.Positioner sideOffset={6} class={tooltip.positioner}><Tooltip.Popup class={tooltip.popup}>{tool.hint}</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root>{/each}</div><div class="mt-30"><button type="button">Elsewhere</button></div></Tooltip.Provider>
