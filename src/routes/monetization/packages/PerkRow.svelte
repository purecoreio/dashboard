<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table";
    import {
        Eraser,
        Loader2,
        MoreVertical,
        Plus,
        Trash,
        Type,
        X,
    } from "lucide-svelte";
    import { Switch } from "$lib/components/ui/switch";
    import type PerkUsage from "$lib/sb/store/sku/perk/PerkUsage";
    import type Perk from "$lib/sb/store/sku/perk/Perk";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import type Product from "$lib/sb/store/sku/Product";
    import Srvbench from "$lib/sb/Srvbench";
    import { onMount } from "svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    export let product: Product,
        perkUsage: PerkUsage | null = null,
        perk: Perk | null = null,
        perkUsages: PerkUsage[],
        perks: Perk[];

    let name: string | null = perkUsage?.perk.name ?? perk?.name ?? null;
    let amount = perkUsage?.amount;
    let enabled = perkUsage != null || perk == null;

    let lastChange: Date | null = null;

    async function updateIfDue() {
        lastChange = new Date();
        const delay = 1000 * 3;
        setTimeout(async () => {
            if (
                lastChange &&
                new Date().getTime() - lastChange.getTime() >= delay
            ) {
                if (
                    (perkUsage && perkUsage.perk.name != name) ||
                    (perk && perk.name != name)
                ) {
                    await updatePerk();
                }

                if (
                    (!perkUsage && amount) ||
                    (perkUsage && perkUsage.amount != amount)
                ) {
                    if (!perkUsage) {
                        await addUsage();
                    } else {
                        await updateUsage();
                    }
                }
            }
        }, delay);
    }

    let description = "";
    let loading = false;

    async function createAndUse() {
        loading = true;
        try {
            const perk = await Srvbench.getInstance()
                .getCommunity()!
                .createPerk(name!, description);
            perks.push(perk);
            product = await product.usePerk(perk, amount);
            perkUsages = product.perks;
            perks = [...perks];
            name = null;
            amount = null;
            enabled = true;
        } catch (error) {}
        loading = false;
    }

    async function updateUsage() {
        if (!perkUsage) return;
        loading = true;
        try {
            product = await perkUsage!.update(amount ?? null);
            perkUsage = product.perks.find((p) => perkUsage!.id == p.id)!;
            perkUsages = product.perks;
            perks = [...perks];
        } catch (error) {}
        loading = false;
    }

    async function addUsage() {
        if (perkUsage) return;
        loading = true;
        try {
            product = await product.usePerk(perk!, amount ?? null);
            perkUsage = product.perks.find((p) => perkUsage!.id == p.id)!;
            perkUsages = product.perks;
            perks = [...perks];
        } catch (error) {
            enabled = !enabled;
        }
        loading = false;
    }

    async function removeUsage() {
        if (!perkUsage) return;
        loading = true;
        try {
            product = await perkUsage!.delete();
            perk = perks.find((p) => p.id == perkUsage!.perk.id)!;
            perkUsage = null;
            perkUsages = product.perks;
            perks = [...perks];
        } catch (error) {
            enabled = !enabled;
        }
        loading = false;
    }

    async function removePerk() {
        loading = true;
        try {
            const deletedPerk = perk ?? perkUsage!.perk;
            await deletedPerk.delete();
            perk = null;
            perkUsage = null;
            perkUsages = perkUsages.filter((p) => p.perk.id != deletedPerk.id);
            perks = perks.filter((p) => p.id != deletedPerk.id);
        } catch (error) {}
        loading = false;
    }

    async function updatePerk() {
        loading = true;
        try {
            const updatedPerk = perk ?? perkUsage!.perk;
            await updatedPerk.update(name!, description);
            perk = updatedPerk;
            perkUsages = perkUsages;
            perks = [...perks];
        } catch (error) {}
        loading = false;
    }

    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    async function handleChange(v: boolean) {
        if (v) {
            await addUsage();
        } else {
            await removeUsage();
        }
    }

    async function clearAmount(){
        amount = null
        await updateIfDue()
    }
</script>

<Table.Row
    class={"items-center align-middle dark:bg-opacity-5" +
        (!perk && !perkUsage ? " bg-white hover:bg-initial" : "")}
>
    <Table.Cell class="text-center">
        {#if !perkUsage && !perk}
            <Badge>New</Badge>
        {:else}
            <Switch
                disabled={loading}
                bind:checked={enabled}
                onCheckedChange={handleChange}
            />
        {/if}
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
        {#if !perkUsage && !perk}
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Button
                        on:click={() => createAndUse()}
                        size="icon"
                        class="rounded-full"
                        disabled={loading}
                    >
                        {#if loading}
                            <Loader2 class="w-4 h-4 animate-spin" />
                        {:else}
                            <Plus class="w-4 h-4" />
                        {/if}
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>Create perk and add to product</p>
                </Tooltip.Content>
            </Tooltip.Root>
        {:else}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button size="icon" variant="outline" class="rounded-full">
                        <MoreVertical class="w-4 h-4" />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-52">
                    <DropdownMenu.Group>
                        <DropdownMenu.Label>
                            {perk?.name ?? perkUsage?.perk.name}
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
        {/if}
    </Table.Cell>
</Table.Row>
