<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type HostingImage from "$lib/sb/machine/container/HostingImage";
    import type HostingTemplate from "$lib/sb/machine/container/HostingTemplate";
    import { onMount } from "svelte";
    import * as Select from "$lib/components/ui/select/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Loader2 } from "lucide-svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import type { Selected } from "bits-ui";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import TemplateRow from "./TemplateRow.svelte";

    export let images: HostingImage[] | null = null;
    let templates: HostingTemplate[] = [];
    let loading = true;
    let adding = false;

    onMount(async () => {
        loading = true;
        try {
            templates = await Srvbench.getInstance()
                .getUser()
                .getHostingTemplates();
        } catch (error) {}
        loading = false;
    });

    async function create() {
        loading = true;
        try {
            if (templateName) templateName = templateName.trim();
            if (!templateName || templateName.length <= 0) templateName = null;
            templates.push(
                await Srvbench.getInstance()
                    .getUser()
                    .createHostingTemplate(
                        images!.find((i) => i.id == templateImage?.value)!,
                        templateName,
                    ),
            );
            templates = templates;
            adding = false;
            templateImage = {
                label: undefined,
                value: null,
            };
            templateName = null;
        } catch (error) {}
        loading = false;
    }

    let templateImage: Selected<any> = {
        label: undefined,
        value: null,
    };

    let templateName: string | null = null;
</script>

<Section title="templates" {loading} bind:adding>
    <div class="flex flex-col gap-3" slot="add">
        <Select.Root>
            {#if images != null}
                <Select.Root bind:selected={templateImage}>
                    <Select.Trigger>
                        <Select.Value placeholder="Select an image" />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            {#each images as image}
                                <Select.Item value={image.id} label={image.uri}>
                                    {image.uri}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
                <div>
                    <Label>Template Name</Label>
                    <Input
                        bind:value={templateName}
                        disabled={loading}
                        placeholder="default"
                    />
                </div>
                <Button on:click={() => create()} disabled={loading}>
                    {#if loading}
                        <Loader2 class="w-4 h-4" />
                    {:else}
                        Create
                    {/if}
                </Button>
            {:else}
                <Button
                    class="flex flex-row gap-3 items-center"
                    disabled
                    variant="outline"
                >
                    Loading Images
                    <Loader2 class="h-4 w-4 animate-spin" />
                </Button>
            {/if}
        </Select.Root>
    </div>
    <Card.Root>
        <Table.Root>
            <Table.Body>
                {#each templates as template}
                    <TemplateRow
                        {template}
                        on:delete={(ev) => {
                            templates = templates.filter((t) => t.id != ev.detail.id);
                        }}
                    />
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
