<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type Category from "$lib/sb/store/Category";
    import { onMount } from "svelte";
    import StoreCategory from "./StoreCategory.svelte";
    import * as Popover from "$lib/components/ui/popover";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Loader2 } from "lucide-svelte";

    let categories: Category[] = [];
    let loadingCategories: boolean = false;
    let creating: boolean = false;

    async function loadCategories() {
        loadingCategories = true;
        try {
            categories = await Srvbench.getInstance()
                .getCommunity()!
                .getCategories();
        } catch (error) {}
        loadingCategories = false;
    }

    let name: string | null;
    let description: string | null;

    async function create() {
        creating = true;
        try {
            categories.push(
                await Srvbench.getInstance()
                    .getCommunity()!
                    .createCategory(name!, description!),
            );
            categories=categories
            name = null;
            description = null;
        } catch (error) {}
        creating = false;
    }

    onMount(async () => {
        await loadCategories();
    });
</script>

<Section title="Categories" loading={loadingCategories}>
    <div class="flex flex-col gap-2" slot="add">
        <div>
            <Label for="name">Name</Label>
            <Input bind:value={name} disabled={creating} id="name" />
        </div>
        <div>
            <Label for="description">Description</Label>
            <Input
                bind:value={description}
                disabled={creating}
                id="description"
            />
        </div>
        <Button on:click={() => create()} disabled={creating}>
            {#if creating}
                <Loader2 class="animate-spin" />
            {:else}
                Create Category
            {/if}
        </Button>
    </div>
    {#each categories as category}
        <StoreCategory {category} />
    {/each}
</Section>
