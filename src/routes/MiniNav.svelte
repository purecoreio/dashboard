<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { ChevronDown } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { page } from "$app/stores";

    export let categories: Record<string, any>;

    $: current = Object.keys(categories).find(
        (m) => m == $page.url.pathname.split("/")[1],
    );
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button class="rounded-full capitalize flex flex-row items-center gap-2" variant="secondary">
            <ChevronDown class="h-4 w-4" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            {#each Object.keys(categories) as category}
                <DropdownMenu.Item
                    href={`/${category}`}
                    class={`capitalize ${category == current ? "font-bold" : ""}`}
                >
                    <svelte:component
                        this={categories[category]}
                        class="w-4 h-4 mr-2"
                    />
                    {category}
                </DropdownMenu.Item>
            {/each}
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
