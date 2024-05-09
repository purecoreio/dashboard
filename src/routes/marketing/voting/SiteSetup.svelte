<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { BadgeCheck, CircleUser, Loader2, Plus } from "lucide-svelte";
    import * as Select from "$lib/components/ui/select";
    import VotingSite from "$lib/sb/voting/VotingSite";
    import { createEventDispatcher, onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import * as Dialog from "$lib/components/ui/dialog";
    import NewSiteSetup from "./NewSiteSetup.svelte";
    import type { Selected } from "bits-ui";
    import type VotingSettings from "$lib/sb/votingSettings/VotingSettings";
    import type { HandlerType } from "$lib/sb/voting/HandlerType";

    const dispatch = createEventDispatcher();

    export let creating: boolean, votingSettings: VotingSettings;
    let loading: boolean = true;

    let votingSites: VotingSite[] = [];

    let owned: Record<string, boolean> = {};
    let verified: Record<string, boolean> = {};
    let selectedSite: Selected<string | null> = {
        value: null,
    };
    let selectedHandler: Selected<string | null> = {
        value: null,
    };
    let url: string | null = null;
    let entrypoint: string | null = null;

    onMount(async () => {
        loading = true;
        try {
            const sites = await Srvbench.getInstance().getVotingSites();
            owned = {};
            for (const site of sites.owned.map((o) => o.id)) {
                owned[site] = true;
            }
            verified = {};
            for (const site of sites.verified.map((o) => o.id)) {
                verified[site] = true;
            }
            const allSites = [...sites.verified, ...sites.owned];
            for (const site of allSites) {
                if (!(site.id in verified)) verified[site.id] = false;
                if (!(site.id in owned)) owned[site.id] = false;
            }
            votingSites = allSites;
        } catch (error) {}
        loading = false;
    });

    function handleSiteCreation(ev: CustomEvent<VotingSite>) {
        owned[ev.detail.id] = true;
        votingSites.push(ev.detail);
        selectedSite = {
            value: ev.detail.id,
        };
        selectedSite = selectedSite;
    }

    $: selectedSite,
        (() => {
            const site = votingSites.find((s) => s.id == selectedSite.value);
            if (site && site.handlerTypes.length == 1) {
                selectedHandler = {
                    value: site.handlerTypes[0],
                };
                selectedHandler = selectedHandler;
            }
        })();

    async function setup() {
        loading = true;
        try {
            const setup = await votingSettings.setupSite(
                votingSites.find((s) => s.id == selectedSite.value)!,
                url!,
                selectedHandler.value! as HandlerType,
                entrypoint,
                null,
                null,
            );

            dispatch("setupsite", setup);

            creating = false;

            url = null;
            entrypoint = null;
            selectedSite = {
                value: null,
            };
            selectedSite = selectedSite;
            selectedHandler = {
                value: null,
            };
            selectedHandler = selectedHandler;
        } catch (error) {}
        loading = false;
    }
</script>

<div>
    <Label>Voting Site</Label>
    <div class="flex flex-row gap-3 items-center">
        <Select.Root
            bind:selected={selectedSite}
            disabled={loading}
        >
            <Select.Trigger>
                <Select.Value placeholder="Site" />
            </Select.Trigger>
            <Select.Content>
                {#each votingSites as site}
                    <Select.Item
                        class="flex flex-row items-center gap-3"
                        value={site.id}
                    >
                        {site.domain}
                        {#if verified[site.id]}
                            <BadgeCheck class="w-4 h-4" />
                        {/if}
                        {#if owned[site.id]}
                            <CircleUser class="w-4 h-4" />
                        {/if}
                    </Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
        <NewSiteSetup on:createdSite={handleSiteCreation} />
    </div>
</div>
<div>
    <Label>Handler</Label>
    <Select.Root
        bind:selected={selectedHandler}
        disabled={loading || selectedSite.value == null}
    >
        <Select.Trigger>
            <Select.Value placeholder="Handler" />
        </Select.Trigger>
        <Select.Content>
            {#if selectedSite.value}
                {#each votingSites.find((s) => s.id == selectedSite.value)?.handlerTypes ?? [] as handlerType}
                    <Select.Item value={handlerType}>
                        {handlerType}
                    </Select.Item>
                {/each}
            {/if}
        </Select.Content>
    </Select.Root>
</div>
<div>
    <Label for="description">URL</Label>
    <Input bind:value={url} disabled={loading} id="description" />
</div>
<div>
    <Label for="entrypoint">Entrypoint</Label>
    <Input bind:value={entrypoint} disabled={loading} id="entrypoint" />
</div>
<Button on:click={() => setup()} disabled={loading || selectedSite == null}>
    {#if loading}
        <Loader2 class="w-4 h-4 animate-spin" />
    {:else}
        Add Site
    {/if}
</Button>
