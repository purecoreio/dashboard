<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import type { Selected } from "bits-ui";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";
    import type HostingTemplate from "$lib/sb/machine/container/HostingTemplate";

    let templates: HostingTemplate[] = [];
    let loading = true;
    export let disabled = false;

    onMount(async () => {
        loading = true;
        try {
            templates = await Srvbench.getInstance()
                .getUser()
                .getHostingTemplates();
        } catch (error) {
            toast.error("unable to load hosting template list");
        }
        loading = false;
    });

    let selectedTemplate: Selected<string | null> = {
        value: null,
    };

    export let template: HostingTemplate | null = null;

    $: selectedTemplate,
        (() =>
            (template =
                templates.find((m) => m.id == selectedTemplate.value) ??
                null))();
</script>

<Select.Root bind:selected={selectedTemplate}>
    <Select.Trigger disabled={loading || disabled}>
        <Select.Value placeholder="Template" />
    </Select.Trigger>
    <Select.Content>
        <Select.Group>
            {#each templates as template}
                <Select.Item
                    value={template.id}
                    label={template.image.uri +
                        "/" +
                        (template.name ?? "default")}
                >
                    {template.image.uri}/{template.name ?? "default"}
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>
