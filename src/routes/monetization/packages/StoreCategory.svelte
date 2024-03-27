<script lang="ts">
    import type Category from "$lib/sb/store/Category";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Label from "$lib/components/ui/label/label.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Plus, ChevronDown, Info } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";

    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import SkuCreation from "./SkuCreation.svelte";
    import SkuOptions from "./SkuOptions.svelte";
    import SkuRow from "./SkuRow.svelte";
    import SkuOptionsMenu from "./SkuOptionsMenu.svelte";
    import type Perk from "$lib/sb/store/sku/perk/Perk";

    const countries = [
        ["ES", "Spain"],
        ["US", "United States"],
    ];

    let loading: boolean = false,
        renaming = false;

    export let category: Category,
        country: string | null = null,
        fallbackCurrency: string | null = null,
        perks: Perk[];

    async function update(
        name?: string,
        description?: string,
        upgradeable?: boolean,
        visible?: boolean,
        disabled?: boolean,
    ) {
        loading = true;
        try {
            category = await category.update(
                name,
                description,
                upgradeable,
                visible,
                disabled,
            );
        } catch (error) {}
        loading = false;
    }
    const dispatch = createEventDispatcher();

    let creatingSku: boolean = false;

    async function remove() {
        loading = true;
        try {
            await category.remove();
            dispatch("delete", category.id);
        } catch (error) {}
        loading = false;
    }

    function handleSkuCreation(event: CustomEvent<void>) {
        category = category;
        creatingSku = false;
    }

    function handleDelete(ev: CustomEvent<string>) {
        category = category;
    }

    async function handleRename(
        ev: CustomEvent<Record<"name" | "description", string>>,
    ) {
        await update(ev.detail.name, ev.detail.description);
    }
</script>

<Card.Root>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-1/4 text-ellipsis">
                    {#if loading}
                        <div>
                            <Skeleton class="h-5 w-full rounded-full" />
                        </div>
                    {:else}
                        <div in:fade class="flex flex-row gap-2 items-center">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <a
                                on:click={() => (renaming = true)}
                                class="text-black dark:text-white cursor-pointer"
                            >
                                {category.name}
                            </a>
                        </div>
                    {/if}
                </Table.Head>
                <Table.Head class="text-ellipsis">
                    <div class="flex flex-row gap-2 items-center">
                        <Label id="country">Price</Label>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button
                                    disabled={loading}
                                    class="flex flex-row gap-1 items-center"
                                    size="sm"
                                    variant="outline"
                                >
                                    {country ?? "Fallback"}
                                    <ChevronDown class="w-4 h-4" />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Group>
                                    <DropdownMenu.Label
                                        >Region</DropdownMenu.Label
                                    >
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item
                                        on:click={() => (country = null)}
                                        >Fallback</DropdownMenu.Item
                                    >
                                    <DropdownMenu.Separator />
                                    {#each countries as countryEntry}
                                        <DropdownMenu.Item
                                            on:click={() =>
                                                (country = countryEntry[0])}
                                            >{countryEntry[1]}</DropdownMenu.Item
                                        >
                                    {/each}
                                </DropdownMenu.Group>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                </Table.Head>
                <Table.Head>Volume</Table.Head>
                <Table.Head class="text-center">Contents</Table.Head>
                <Table.Head class="flex flex-row items-center justify-between">
                    <div>
                        <SkuOptions
                            {loading}
                            upgradeable={category.upgradeable}
                            visible={category.visible}
                            disabled={category.disabled}
                            on:disabled={() =>
                                update(
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    !category.disabled,
                                )}
                            on:visible={() =>
                                update(
                                    undefined,
                                    undefined,
                                    undefined,
                                    !category.visible,
                                )}
                            on:upgradeable={() =>
                                update(
                                    undefined,
                                    undefined,
                                    !category.upgradeable,
                                )}
                        />
                    </div>
                    <Popover.Root bind:open={creatingSku}>
                        <Popover.Trigger asChild let:builder>
                            <Button
                                builders={[builder]}
                                disabled={loading}
                                class="flex flex-row gap-1 items-center"
                                variant="secondary"
                                size="sm"
                            >
                                <Plus class="w-4 h-4" /> Add
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content class="w-80">
                            <SkuCreation
                                on:created={handleSkuCreation}
                                {fallbackCurrency}
                                {category}
                            />
                        </Popover.Content>
                    </Popover.Root>
                    <SkuOptionsMenu
                        {loading}
                        name={category.name}
                        description={category.description}
                        disabled={category.disabled}
                        upgradeable={category.upgradeable}
                        visible={category.visible}
                        bind:renaming
                        on:disabled={() =>
                            update(
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                !category.disabled,
                            )}
                        on:visible={() =>
                            update(
                                undefined,
                                undefined,
                                undefined,
                                !category.visible,
                            )}
                        on:upgradeable={() =>
                            update(undefined, undefined, !category.upgradeable)}
                        on:delete={() => remove()}
                        on:rename={handleRename}
                    ></SkuOptionsMenu>
                </Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each category.skus as sku}
                <SkuRow on:delete={handleDelete} {sku} {country} {perks} />
            {/each}
        </Table.Body>
    </Table.Root>
</Card.Root>
