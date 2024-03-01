<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import type VotingSettings from "$lib/sb/votingSettings/VotingSettings";
    import type VotingHandler from "$lib/sb/votingSettings/handler/VotingHandler";
    import { onMount } from "svelte";
    import VotingHandlerCard from "./VotingHandlerCard.svelte";
    import NuVotifierHandler from "$lib/sb/votingSettings/handler/NuVotifierHandler";
    import VotifierHandler from "$lib/sb/votingSettings/handler/VotifierHandler";
    import Section from "$lib/components/serverbench/section.svelte";
    import type VotingSiteSetup from "$lib/sb/votingSettings/VotingSiteSetup";
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    import { ExternalLink } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";

    let settings: VotingSettings | null = null;
    let sites: VotingSiteSetup[] = [];
    let handlers: VotingHandler[] = [];

    onMount(async () => {
        const s = await Srvbench.getInstance()
            .getCommunity()!
            .getVotingSettings();
        handlers = await s.getCredentials();
        sites = s.sites;
        settings = s;
    });
</script>

<Section title="Handlers">
    {#each handlers as handler}
        {#if handler instanceof NuVotifierHandler || handler instanceof VotifierHandler}
            <VotingHandlerCard {handler} />
        {/if}
    {/each}
</Section>

<Section title="Sites">
    <Card.Root>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Website</Table.Head>
                    <Table.Head>Score</Table.Head>
                    <Table.Head class="text-right">Handler</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each sites as site}
                    <Table.Row>
                        <Table.Cell class="font-medium flex flex-row items-center">
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <Button
                                        variant="link"
                                        href={site.url}
                                        target="_blank"
                                    >
                                        <ExternalLink class="w-4 h-4" />
                                    </Button>
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p>{site.url}</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                            {site.site.domain}
                        </Table.Cell>
                        <Table.Cell>
                            {site.score}%
                        </Table.Cell>
                        <Table.Cell class="text-right">
                            {site.handlerType}
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
