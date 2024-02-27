<script lang="ts">
    import VotingSiteSelector from "./VotingSiteSelector.svelte";
    import {
        Button,
        ButtonGroup,
        Input,
        Label,
        Modal,
        Select,
        Toggle,
    } from "flowbite-svelte";
    import Section from "../../../../element/Section.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import VotingSettings from "$lib/sb/votingSettings/VotingSettings";
    import { onMount } from "svelte";
    import type VotingSite from "$lib/sb/voting/VotingSite";
    import type { HandlerType } from "$lib/sb/voting/HandlerType";

    export let open = false,
        loading = false;

    let h = true;
    let cooldown = 0;
    let time: string | null = null;
    let url: string | null = null;
    let overrideResets = false;
    let entrypointDomain = false;
    let entrypointDomainValue: string | null = null;
    let handlers: any = [];
    let handler: string | null = null;

    function updateHandlers() {
        if (votingSite == null) {
            handlers = [];
            handler = null;
        } else {
            handlers = votingSite.handlerTypes.map((h) => {
                return {
                    name: h,
                    value: h,
                };
            });
            handler = handlers[0]?.value ?? null;
        }
    }

    $: votingSite, updateHandlers();

    let votingSettings: VotingSettings | null = null;
    let votingSite: VotingSite;
    onMount(async () => {
        loading = true;
        votingSettings = await Srvbench.getInstance()
            .getCommunity()!
            .getVotingSettings();
        loading = false;
    });

    async function add() {
        loading = true;
        try {
            await votingSettings?.setupSite(
                votingSite,
                url!,
                handler! as HandlerType,
                entrypointDomain ? entrypointDomainValue : null,
                overrideResets ? cooldown : null,
                overrideResets ? getParsedTime() : null,
            );
            open = false
        } catch (error) {
            
        }
        loading = false;
    }

    function getParsedTime() {
        if (!time) return null;
        const [h, m] = time.split(":");
        const n = Number(h) * 3600 + Number(m) * 60;
        if (n < 0 || n >= 3600 * 24) return 0;
        return n;
    }
</script>

<Modal title="Setup Voting Site" bind:open>
    <div class="flex flex-col gap-3">
        <VotingSiteSelector bind:votingSite />
        <Label>
            Handler
            <Select bind:value={handler} items={handlers} />
        </Label>
        <Label>
            Voting URL
            <Input disabled={loading} bind:value={url} />
        </Label>
        <Toggle bind:checked={entrypointDomain} disabled={loading}
            >Entrypoint Domain</Toggle
        >
        {#if entrypointDomain}
            <Section>
                <Label>
                    Domain/Address
                    <Input
                        disabled={loading}
                        bind:value={entrypointDomainValue}
                    />
                </Label>
            </Section>
        {/if}
        <Toggle bind:checked={overrideResets} disabled={loading}
            >Override timings</Toggle
        >
        {#if overrideResets}
            <Section>
                <Label>
                    Cooldown
                    <div class="flex flex-row gap-3">
                        <Input
                            disabled={loading}
                            bind:value={cooldown}
                            type="number"
                        />
                        <ButtonGroup>
                            <Button
                                disabled={loading}
                                color={h ? "primary" : undefined}
                                on:click={() => (h = true)}>H</Button
                            >
                            <Button
                                disabled={loading}
                                color={!h ? "primary" : undefined}
                                on:click={() => (h = false)}>m</Button
                            >
                        </ButtonGroup>
                    </div>
                </Label>
                <Label>
                    Reset Time (UTC)
                    <Input disabled={loading} bind:value={time} type="time" />
                </Label>
            </Section>
        {/if}
    </div>
    <svelte:fragment slot="footer">
        <div class="flex-row justify-between flex w-full">
            <Button disabled={loading} on:click={() => (open = false)}
                >Cancel</Button
            >
            <Button disabled={loading} on:click={add}>Add</Button>
        </div>
    </svelte:fragment>
</Modal>
