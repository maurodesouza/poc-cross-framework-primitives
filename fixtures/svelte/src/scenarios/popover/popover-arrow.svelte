<script lang="ts">
import { popover } from "@poc/styles";
import { Popover } from "@poc/svelte";
</script><Popover.Root><Popover.Trigger class={popover.trigger}>With arrow</Popover.Trigger><Popover.Portal><Popover.Positioner class={popover.positioner} sideOffset={10}><Popover.Popup class={popover.popup}><Popover.Arrow class={popover.arrow} data-testid="arrow" /><Popover.Title class={popover.title}>Arrow</Popover.Title></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root>
