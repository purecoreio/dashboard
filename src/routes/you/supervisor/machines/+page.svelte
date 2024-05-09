<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type Machine from "$lib/sb/machine/Machine";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import MachineRow from "./MachineRow.svelte";

    let machines: Machine[] = [];
    let loading = true;
    let adding = false;

    onMount(async () => {
        loading = true;
        try {
            machines = await Srvbench.getInstance().getUser().getMachines();
        } catch (error) {}
        loading = false;
    });

    async function createMachine() {
        loading = true;
        try {
            machines.unshift(
                await Srvbench.getInstance().getUser().createMachine(),
            );
            adding = false;
        } catch (error) {
            console.log(error);
        }
        loading = false;
    }
</script>

<Section title="machines" {loading} bind:adding>
    <div class="flex flex-col gap-3" slot="add">
        <Button
            target="_blank"
            href="https://github.com/purecoreio/supervisor/releases"
            variant="outline">Download Supervisor</Button
        >
        <Button on:click={() => createMachine()}>Create Machine</Button>
    </div>
    <Card.Root>
        <Table.Root>
            <Table.Body>
                {#each machines as machine}
                    <MachineRow
                        on:delete={(ev) => {
                            machines = machines.filter(
                                (m) => m.id != ev.detail.id,
                            );
                        }}
                        {machine}
                    />
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
