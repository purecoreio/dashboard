<script lang="ts">
    import type Machine from "$lib/sb/machine/Machine";
    import { toast } from "svelte-sonner";
    import Button from "$lib/components/ui/button/button.svelte";
    import {
        Link2,
        HelpCircle,
        MoreVertical,
        KeyRound,
        Loader2,
        Trash2,
    } from "lucide-svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import copyTextToClipboard from "copy-text-to-clipboard";
    import { createEventDispatcher } from "svelte";

    export let machine: Machine;
    let token: string | null;

    let loading = false;

    async function copyToken() {
        loading = true;
        try {
            if (!token) {
                token = await machine.getToken();
            }
            copyTextToClipboard(token);
            toast.success("Copied to clipboard");
        } catch (error) {
            if (!token) {
                toast.error("Unable to retrieve token");
            } else {
                toast.error("Unable to copy to clipboard", {
                    description: "token: " + token,
                });
            }
        }
        loading = false;
    }

    const dispatch = createEventDispatcher();
    async function remove() {
        loading = true;
        try {
            await machine.delete();
            toast.success(
                "deleted machine " +
                    (machine.hostname ?? machine.created.toLocaleString()),
            );
            dispatch("delete", machine);
        } catch (error) {}
        loading = false;
    }
</script>

<Table.Row>
    <Table.Cell>
        <div class="flex flex-row gap-3 items-center">
            {#if machine.hostname}
                <Link2 class="w-4 h-4" />
            {:else}
                <HelpCircle class="w-4 h-4" />
            {/if}
            {#if machine.hostname}
                {machine.hostname}
            {:else}
                {machine.created.toLocaleString()}
            {/if}
        </div>
    </Table.Cell>
    <Table.Cell class="text-right">
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button
                    disabled={loading}
                    builders={[builder]}
                    class="rounded-full"
                    variant="outline"
                    size="icon"
                >
                    {#if loading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        <MoreVertical class="w-4 h-4" />
                    {/if}
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Group>
                    <DropdownMenu.Item
                        on:click={() => copyToken()}
                        class="flex flex-row gap-2"
                    >
                        <KeyRound class="w-4 h-4" />
                        Copy Token
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        on:click={() => remove()}
                        class="flex flex-row gap-2 text-red-500"
                    >
                        <Trash2 class="w-4 h-4" />
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Table.Cell>
</Table.Row>
