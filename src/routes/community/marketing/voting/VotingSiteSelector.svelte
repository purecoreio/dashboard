<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import type VotingSite from "$lib/sb/voting/VotingSite";
    import { Button, Label, Select } from "flowbite-svelte";
    import { onMount } from "svelte";
    import Add from "~icons/ic/baseline-plus";
    import NewVotingSite from "./NewVotingSite.svelte";

    export let votingSite: VotingSite | null;

    let loading = false;
    let ownedVotingSites: VotingSite[] = [];
    let verifiedVotingSites: VotingSite[] = [];
    let add = false;
    $: add, loadVotingSites();
    $: votingSiteId, updateVotingSite();

    function updateVotingSite() {
        votingSite =
            [...ownedVotingSites, ...verifiedVotingSites].find(
                (s) => s.id == votingSiteId,
            ) ?? null;
    }

    async function loadVotingSites() {
        loading = true;
        const previous = ownedVotingSites.map((s) => s.id);
        const sites = await Srvbench.getInstance().getVotingSites();
        ownedVotingSites = sites.owned;
        if (previous.length > 0 && ownedVotingSites.length < previous.length) {
            for (const site of ownedVotingSites) {
                if (!previous.find((s) => s == site.id)) {
                    votingSiteId = site.id;
                    break;
                }
            }
        }
        verifiedVotingSites = sites.verified;
        loading = false;
    }

    $: sites = [...ownedVotingSites, ...verifiedVotingSites].map((s) => {
        return {
            value: s.id,
            name: s.domain,
        };
    });

    let votingSiteId: string;

    onMount(async () => {
        await loadVotingSites();
    });
</script>

<NewVotingSite bind:show={add} />
<div class="flex flex-row gap-3 items-center">
    <div class="flex-grow">
        <Select disabled={loading} items={sites} bind:value={votingSiteId} />
    </div>
    <div class="flex-shrink">
        <Button on:click={() => (add = true)} class="py-3"><Add /></Button>
    </div>
</div>
