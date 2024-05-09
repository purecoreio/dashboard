<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { MoreVertical, Loader2, Trash2, Circle } from "lucide-svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { createEventDispatcher } from "svelte";
    import { toast } from "svelte-sonner";
    import type HostingTemplate from "$lib/sb/machine/container/HostingTemplate";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import Page from "../+page.svelte";

    export let template: HostingTemplate;
    let loading = false;

    const dispatch = createEventDispatcher();
    async function remove() {
        loading = true;
        try {
            await template.delete();
            toast.success("deleted template " + template.name);
            dispatch("delete", template);
        } catch (error) {}
        loading = false;
    }
</script>

<Table.Row>
    <Table.Cell>
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link>{template.image.uri}</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>
                        {#if template.name}
                            {template.name}
                        {:else}
                            <div class="flex flex-row gap-2 items-center">
                                <span> default </span>
                                <Circle class="w-4 h-4" />
                            </div>
                        {/if}
                    </Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
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
