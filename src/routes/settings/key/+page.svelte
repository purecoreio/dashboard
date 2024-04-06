<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import type Key from "$lib/sb/Key";
    import Srvbench from "$lib/sb/Srvbench";
    import { onMount } from "svelte";
    import KeyEntry from "./KeyEntry.svelte";

    let keys: Key[] = [];
    let loading = false;

    onMount(async () => {
        loading = true;
        try {
            keys = await Srvbench.getInstance().getCommunity()!.getKeys();
        } catch (error) {}
        loading = false;
    });
</script>

<Section title="Keys" bind:loading>
    {#each keys as key}
        <KeyEntry {key} />
    {/each}
</Section>
