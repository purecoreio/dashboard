<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import Todo from "$lib/components/serverbench/todo.svelte";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Loader2 } from "lucide-svelte";
    import type Category from "$lib/sb/store/Category";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let skuName: string | null = null;
    let skuDescription: string | null = null;
    let skuPrice: number | null = null;
    let skuType: "product" | "bundle" = "product";
    let loadingSku = false;

    export let fallbackCurrency: string | null, category: Category;

    async function createSku() {
        loadingSku = true;
        try {
            if (skuType == "product") {
                dispatch(
                    "created",
                    await category.createProduct(
                        skuName!,
                        skuDescription ?? "",
                        skuPrice!,
                    ),
                );
            } else if (skuType == "bundle") {
                throw new Error("WIP");
            }
        } catch (error) {}
        loadingSku = false;
    }
</script>

<Tabs.Root class="flex flex-col gap-3" bind:value={skuType}>
    <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="product">Product</Tabs.Trigger>
        <Tabs.Trigger value="bundle">Bundle</Tabs.Trigger>
    </Tabs.List>
    <div class="flex flex-col gap-3">
        <div>
            <Label for="name">Name</Label>
            <Input bind:value={skuName} id="name" />
        </div>
        <div>
            <Label for="description">Description</Label>
            <Input bind:value={skuDescription} id="description" />
        </div>
        <div>
            <Label for="price">Default Price</Label>
            <div class="flex flex-row gap-3 items-center">
                <Input class="w-1/4" bind:value={fallbackCurrency} disabled />
                <Input type="number" min="0" bind:value={skuPrice} id="price" />
            </div>
        </div>
    </div>
    <Tabs.Content value="bundle">
        <Todo />
    </Tabs.Content>
    <Button on:click={() => createSku()}>
        {#if loadingSku}
            <Loader2 class="animate-spin w-4 h-4" />
        {:else}
            Create
        {/if}
    </Button>
</Tabs.Root>
