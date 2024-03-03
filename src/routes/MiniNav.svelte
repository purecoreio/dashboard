<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { ChevronDown } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { page } from "$app/stores";

    export let categories: Record<string, any>,
        currentCategory: string | null,
        base: string;
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button
            class="rounded-full capitalize flex flex-row items-center gap-2"
            variant="secondary"
        >
            <ChevronDown class="h-4 w-4" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            {#each Object.keys(categories) as category}
                <DropdownMenu.Item
                    href={`${base}/${category}/${categories[category].options[0]}`}
                    class={`capitalize ${category == currentCategory ? "font-bold" : ""}`}
                >
                    <svelte:component
                        this={categories[category].icon}
                        class="w-4 h-4 mr-2"
                    />
                    {category}
                </DropdownMenu.Item>
            {/each}
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
