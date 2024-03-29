<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type Category from "$lib/sb/store/Category";
    import { onMount } from "svelte";
    import StoreCategory from "./StoreCategory.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Loader2 } from "lucide-svelte";
    import type Perk from "$lib/sb/store/sku/perk/Perk";

    let categories: Category[] = [];
    let loadingCategories: boolean = false;
    let fallbackCurrency: string | null = null;
    let creating: boolean = false;
    let perks: Perk[] = [];

    let country: string | null = null;

    async function loadCategories() {
        loadingCategories = true;
        try {
            categories = await Srvbench.getInstance()
                .getCommunity()!
                .getCategories();
        } catch (error) {
            console.log(error);
        }
        loadingCategories = false;
    }

    function handleDelete(customEvent: CustomEvent<string>) {
        categories = categories.filter((c) => c.id != customEvent.detail);
    }

    let name: string | null;
    let description: string | null;

    async function create() {
        creating = true;
        try {
            categories.push(
                await Srvbench.getInstance()
                    .getCommunity()!
                    .createCategory(name!, description ?? ""),
            );
            categories = categories;
            name = null;
            description = null;
            addingCategory = false;
        } catch (error) {}
        creating = false;
    }

    let addingCategory: boolean = false;

    onMount(async () => {
        let _: void;
        [_, fallbackCurrency, perks] = await Promise.all([
            loadCategories(),
            Srvbench.getInstance().getCommunity()!.getFallbackCurrency(),
            Srvbench.getInstance().getCommunity()!.getPerks(),
        ]);
    });
</script>

<Section
    title="Categories"
    loading={loadingCategories}
    bind:adding={addingCategory}
>
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
                <Loader2 class="w-4 h-4 animate-spin" />
            {:else}
                Create Category
            {/if}
        </Button>
    </div>
    {#each categories as category}
        <StoreCategory
            on:delete={handleDelete}
            bind:country
            {category}
            {fallbackCurrency}
            bind:perks
        />
    {/each}
</Section>
