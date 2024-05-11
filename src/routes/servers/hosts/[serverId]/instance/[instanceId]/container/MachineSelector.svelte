<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import type Machine from "$lib/sb/machine/Machine";
    import type { Selected } from "bits-ui";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";

    let machines: Machine[] = [];
    let loading = true;
    export let disabled = false;

    onMount(async () => {
        loading = true;
        try {
            machines = await Srvbench.getInstance().getUser().getMachines();
        } catch (error) {
            toast.error("unable to load machine list");
        }
        loading = false;
    });

    let selectedMachine: Selected<string | null> = {
        value: null,
    };

    export let machine: Machine | null = null;

    $: selectedMachine,
        (() =>
            (machine =
                machines.find((m) => m.id == selectedMachine.value) ?? null))();
</script>

<Select.Root bind:selected={selectedMachine}>
    <Select.Trigger disabled={loading || disabled}>
        <Select.Value placeholder="Machine" />
    </Select.Trigger>
    <Select.Content>
        <Select.Group>
            {#each machines as machine}
                <Select.Item
                    value={machine.id}
                    label={machine.hostname ?? machine.created.toLocaleString()}
                >
                    {machine.hostname ?? machine.created.toLocaleString()}
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>
