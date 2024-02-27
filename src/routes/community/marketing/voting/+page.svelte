<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import type VotingSettings from "$lib/sb/votingSettings/VotingSettings";
    import {
        Card,
        Helper,
        Input,
        Label,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toggle,
        Button,
    } from "flowbite-svelte";
    import Launch from "~icons/mdi/launch";
    import { onMount } from "svelte";
    import NewVotingSiteSetup from "./NewVotingSiteSetup.svelte";
    import Section from "../../../../element/Section.svelte";

    $: sites = settings?.sites ?? [];
    let settings: VotingSettings;
    let featuredSites: number | null = null;
    let featuredSitesHeadroom: number | null = null;
    let autoscore: boolean = false;
    let autoscoringQueries: string[] = [];
    let open: boolean = false;
    onMount(async () => {
        settings = await Srvbench.getInstance()
            .getCommunity()!
            .getVotingSettings();
        await settings.regenCredentials('NuVotifier')
        featuredSites = settings.featuredSites;
        featuredSitesHeadroom = settings.featuredSitesHeadroom;
        autoscore = settings.autoscore;
        autoscoringQueries = settings.autoscoringQueries;
    });
</script>

<Card class="max-w-full flex-col gap-3">
    <h1 class="text-black font-semibold">Vote Settings</h1>
    <Toggle checked={true}>Featured-unfeatured scheme</Toggle>
    <div>
        <Label for="large-input">Featured Sites</Label>
        <Input id="large-input" bind:value={featuredSites} />
    </div>
    <div>
        <Label for="large-input">Featured Sites Headroom</Label>
        <Input id="large-input" bind:value={featuredSitesHeadroom} />
        <Helper class="text-xs text-opacity-50">
            If some featured sites fail, the member can vote on the next best
            non-featured sites
        </Helper>
    </div>
    <Toggle bind:checked={autoscore}>Google Autoscoring</Toggle>
    <div
        class:opacity-50={!autoscore}
        class="ring-1 ring-opacity-10 ring-black rounded overflow-hidden transition"
    >
        <Table>
            <TableBody>
                <TableBodyRow>
                    <TableBodyCell>minecraft 1.20 server</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>minecraft 1.20 smp</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>survival minecraft server</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>vanilla minecraft server</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>vanilla 1.20 server</TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
    </div>
</Card>
<Card class="max-w-full flex-col gap-3">
    <h1 class="text-black font-semibold">Vote Engagement</h1>
    <Toggle checked={true}>Push Notifications</Toggle>
    <Toggle checked={true}>Streak Rewards</Toggle>
    <Toggle checked={true}>Ranking Rewards</Toggle>
    <Toggle checked={true}>Discord Rewards</Toggle>
</Card>
<Card class="max-w-full flex-col gap-3">
    <h1 class="text-black font-semibold">Vote Handlers</h1>
    <div class="ring-1 ring-opacity-10 ring-black rounded overflow-hidden">
        <Table>
            <TableHead>
                <TableHeadCell>Votifier</TableHeadCell>
            </TableHead>
            <TableBody>
                <TableBodyRow>
                    <TableBodyCell>Address</TableBodyCell>
                    <TableBodyCell>
                        <div class="flex flex-row gap-3">
                            <Input value="einstein.v.serverbench.io" disabled />
                            <Input
                                defaultClass="w-20 opacity-50"
                                value="7310"
                                disabled
                            />
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Credentials</TableBodyCell>
                    <TableBodyCell>
                        <div class="flex flex-col gap-3">
                            <Input
                                type="password"
                                value="this should be a public key"
                                disabled
                            />
                            <Input
                                type="password"
                                value="this should be a public key"
                                disabled
                            />
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Forwarding</TableBodyCell>
                    <TableBodyCell>
                        <div class="flex flex-col gap-3">
                            <Toggle checked={true}>Forward Votes</Toggle>
                            <div class="flex flex-row gap-3">
                                <Input value="vote.purevanilla.co" />
                                <Input defaultClass="w-20" value="3306" />
                            </div>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
    </div>
</Card>
<NewVotingSiteSetup bind:open />
<Card class="max-w-full flex flex-col gap-3">
    <h1 class="text-black font-semibold">Voting Sites</h1>
    <Section slim>
        <Table>
            <TableBody>
                {#each sites as site}
                    <TableBodyRow>
                        <TableBodyCell>{site.site.domain}</TableBodyCell>
                        <TableBodyCell>{site.handlerType}</TableBodyCell>
                        <TableBodyCell>
                            <div class="text-right">
                                <Button color="alternative" href={site.url}>
                                    <Launch />
                                </Button>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </Section>
    <Button on:click={() => (open = true)}>Add Voting Site</Button>
</Card>
