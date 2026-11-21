<script lang="ts">
import { menu as styles } from "@poc/styles";
import { Menu } from "@poc/svelte";
import Output from "../../kit/output.svelte";
import { MenuOutput } from "./menu-output.svelte.ts";

const menu = new MenuOutput();
</script><Menu.Root bind:open={menu.open} onOpenChange={menu.onOpenChange}><Menu.Trigger class={styles.trigger}>File</Menu.Trigger><Menu.Portal><Menu.Positioner class={styles.positioner} sideOffset={4}><Menu.Popup class={styles.popup}><Menu.Item class={styles.item} onclick={menu.select("New file")}>New file</Menu.Item><Menu.SubmenuRoot><Menu.SubmenuTrigger class={styles["submenu-trigger"]}>Share</Menu.SubmenuTrigger><Menu.Portal><Menu.Positioner class={styles.positioner}><Menu.Popup class={styles.popup}><Menu.Item class={styles.item} onclick={menu.select("Email")}>Email</Menu.Item><Menu.Item class={styles.item} onclick={menu.select("Link")}>Link</Menu.Item><Menu.Item class={styles.item} onclick={menu.select("Slack")}>Slack</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.SubmenuRoot><Menu.Item class={styles.item} onclick={menu.select("Print")}>Print</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root><Output values={{ open: menu.open, reason: menu.reason, action: menu.action }} />
