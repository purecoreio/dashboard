<script lang="ts">
    import type Category from "$lib/sb/store/Category";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Label from "$lib/components/ui/label/label.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Plus, Type, ChevronDown, Info } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";

    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import SkuCreation from "./SkuCreation.svelte";
    import SkuOptions from "./SkuOptions.svelte";
    import SkuRow from "./SkuRow.svelte";
    import SkuOptionsMenu from "./SkuOptionsMenu.svelte";

    const countries = [
        ["ES", "Spain"],
        ["US", "United States"],
    ];

    let loading: boolean = false,
        renaming = false,
        deleting = false;

    export let category: Category,
        country: string | null = null,
        fallbackCurrency: string | null = null;

    let name = category.name,
        description = category.description;

    async function update(
        name?: string,
        description?: string,
        upgradeable?: boolean,
        visible?: boolean,
        disabled?: boolean,
    ) {
        loading = true;
        deleting = false;
        renaming = false;
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
</script>

<AlertDialog.Root bind:open={deleting}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
                All packages located on <b>{category.name}</b> will be removed too!
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action on:click={() => remove()}
                >Continue</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
<Dialog.Root bind:open={renaming}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Edit {category.name}</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div>
                <Label for="name">Name</Label>
                <Input id="name" bind:value={name} />
            </div>
            <div>
                <Label for="description">Description</Label>
                <Input id="description" bind:value={description} />
            </div>
        </div>
        <Dialog.Footer>
            <Button on:click={() => update(name, description)} type="submit"
                >Save changes</Button
            >
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<Card.Root class="mb-3">
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
                <Table.Head class="w-1/3 text-ellipsis">
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

                        <Tooltip.Root>
                            <Tooltip.Trigger>
                                <Button variant="ghost" size="sm">
                                    <Info class="w-4 h-4" />
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>Price internationalization</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </div>
                </Table.Head>
                <Table.Head>Volume</Table.Head>
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
                        disabled={category.disabled}
                        upgradeable={category.upgradeable}
                        visible={category.visible}
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
                        on:delete={() => (deleting = true)}
                    >
                        <DropdownMenu.Item
                            on:click={() => (renaming = true)}
                            class="flex flex-row items-center gap-2"
                        >
                            <Type class="w-4 h-4" />
                            Title/Description
                        </DropdownMenu.Item>
                    </SkuOptionsMenu>
                </Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each category.skus as sku}
                <SkuRow on:delete={handleDelete} {sku} {country} />
            {/each}
        </Table.Body>
    </Table.Root>
</Card.Root>
