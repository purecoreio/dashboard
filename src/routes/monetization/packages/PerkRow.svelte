<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Eraser, MoreVertical, Plus, Trash, Type, X } from "lucide-svelte";
    import type Perk from "$lib/sb/store/sku/perk/Perk";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import type Product from "$lib/sb/store/sku/Product";
    import { createEventDispatcher, onMount } from "svelte";
    import type PerkUsage from "$lib/sb/store/sku/perk/PerkUsage";
    import Switch from "$lib/components/ui/switch/switch.svelte";

    export let perk: Perk, perkUsage: PerkUsage | null, product: Product;

    const dispatch = createEventDispatcher();

    let amount: number | null = perkUsage?.amount ?? null;
    let enabled: boolean = perkUsage != null;
    let lastChange: Date | null = null;
    let name: string = perk.name;
    let description: string = perk.description;
    let loading: boolean = false;
    const updateDelay = 2000;

    async function updateIfDue() {
        lastChange = new Date();
        setTimeout(async () => {
            if (new Date().getTime() - lastChange!.getTime() >= updateDelay) {
                await update();
            }
        }, updateDelay);
    }

    async function update() {
        // usage amount
        if (perkUsage && perkUsage!.amount != amount) {
            await updateUsage();
        } else if (!perkUsage && amount) {
            await addUsage();
        }
        // perk details
        if (perk.name != name || perk.description != description) {
            loading = true;
            try {
                perk = await perk.update(name, description);
                dispatch("update", perk);
            } catch (error) {}
            loading = false;
        }
    }

    async function removePerk() {
        loading = true;
        try {
            await perk.delete();
            dispatch("delete", perk);
        } catch (error) {}
        loading = false;
    }

    async function updateUsage() {
        loading = true;
        try {
            product = await perkUsage!.update(amount);
            product = product;
            dispatch("usage", product);
        } catch (error) {}
        loading = false;
    }

    async function removeUsage() {
        loading = true;
        try {
            product = await perkUsage!.delete();
            product = product;
            dispatch("usage", product);
        } catch (error) {}
        loading = false;
    }

    async function addUsage() {
        loading = true;
        try {
            product = await product.usePerk(perk, amount);
            perkUsage = product.perks.find((p) => p.perk.id == perk.id)!;
            product = product;
            dispatch("usage", product);
        } catch (error) {}
        loading = false;
    }

    async function clearAmount() {
        amount = null;
        await updateIfDue();
    }

    async function handleChange() {
        if (perkUsage) {
            await removeUsage();
            enabled = false;
        } else {
            await addUsage();
            enabled = true;
        }
    }
</script>

<Table.Row class="items-center align-middle transition duration-1000">
    <Table.Cell class="text-center">
        <Switch
            bind:checked={enabled}
            disabled={loading}
            onCheckedChange={handleChange}
        />
    </Table.Cell>
    <Table.Cell>
        <Input
            disabled={loading}
            bind:value={name}
            placeholder="name"
            on:keyup={() => updateIfDue()}
        />
    </Table.Cell>
    <Table.Cell>
        <div class="flex flex-row items-center gap-2">
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Input
                        disabled={loading}
                        bind:value={amount}
                        on:keyup={() => updateIfDue()}
                        placeholder="amount"
                        type="number"
                    />
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>
                        You can leave this empty if your perk is not numerable
                    </p>
                </Tooltip.Content>
            </Tooltip.Root>
            <div>
                <Button
                    on:click={() => clearAmount()}
                    size="icon"
                    variant="ghost"
                    disabled={loading}
                >
                    <Eraser class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </Table.Cell>
    <Table.Cell>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button size="icon" variant="outline" class="rounded-full">
                    <MoreVertical class="w-4 h-4" />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-52">
                <DropdownMenu.Group>
                    <DropdownMenu.Label>
                        {perk.name}
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                        on:click={() => removeUsage()}
                        class="flex flex-row items-center gap-2"
                    >
                        <Type class="w-4 h-4" />
                        Change Description
                    </DropdownMenu.Item>
                    {#if perkUsage}
                        <DropdownMenu.Item
                            on:click={() => removeUsage()}
                            class="flex flex-row items-center gap-2"
                        >
                            <X class="w-4 h-4" />
                            Remove From This
                        </DropdownMenu.Item>
                    {:else}
                        <DropdownMenu.Item
                            on:click={() => addUsage()}
                            class="flex flex-row items-center gap-2"
                        >
                            <Plus class="w-4 h-4" />
                            Add To This
                        </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                        on:click={() => removePerk()}
                        class="text-destructive flex flex-row items-center gap-2"
                    >
                        <Trash class="w-4 h-4" /> Remove From All
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Table.Cell>
</Table.Row>
