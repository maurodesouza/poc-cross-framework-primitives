<script lang="ts">
import { menu as styles } from "@poc/styles";
import { Menu } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import { MenuOutput } from "./menu-output.svelte.ts";

const menu = new MenuOutput();
</script><Menu.Root bind:open={menu.open} onOpenChange={menu.onOpenChange}><Menu.Trigger class={styles.trigger}>Actions</Menu.Trigger><Menu.Portal><Menu.Positioner class={styles.positioner} sideOffset={4}><Menu.Popup class={styles.popup}><Menu.Item class={styles.item} onclick={menu.select("Edit")}>Edit</Menu.Item><Menu.Item class={styles.item} onclick={menu.select("Duplicate")}>Duplicate</Menu.Item><Menu.Item class={styles.item} disabled onclick={menu.select("Archive")}>Archive</Menu.Item><Menu.Separator class={styles.separator} /><Menu.Item class={styles.item} onclick={menu.select("Delete")}>Delete</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root><button type="button" class="ms-2">After menu</button><Output values={{ open: menu.open, reason: menu.reason, action: menu.action }} />
