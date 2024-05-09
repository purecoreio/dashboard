<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { MoreVertical, Loader2, Trash2 } from "lucide-svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import type HostingImage from "$lib/sb/machine/container/HostingImage";
    import { createEventDispatcher } from "svelte";
    import { toast } from "svelte-sonner";


    export let image: HostingImage;
    let loading = false;

    const dispatch = createEventDispatcher();
    async function remove() {
        loading = true;
        try {
            await image.delete();
            toast.success("deleted image " + image.uri);
            dispatch("delete", image);
        } catch (error) {}
        loading = false;
    }
</script>

<Table.Row>
    <Table.Cell>
        {image.uri}
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
