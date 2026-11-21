<script lang="ts">
import { menu as styles } from "@poc/styles";
import { Menu } from "@poc/svelte";
</script><Menu.Root><Menu.Trigger class={styles.trigger}>View</Menu.Trigger><Menu.Portal><Menu.Positioner class={styles.positioner} sideOffset={4}><Menu.Popup class={styles.popup}><Menu.Group class={styles.group}><Menu.GroupLabel class={styles["group-label"]}>Sort by</Menu.GroupLabel><Menu.Item class={styles.item}>Name</Menu.Item><Menu.Item class={styles.item}>Date</Menu.Item></Menu.Group><Menu.Separator class={styles.separator} /><Menu.Group class={styles.group}><Menu.GroupLabel class={styles["group-label"]}>Show</Menu.GroupLabel><Menu.Item class={styles.item}>Hidden files</Menu.Item></Menu.Group></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root>
