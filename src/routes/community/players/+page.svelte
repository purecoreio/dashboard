<script lang="ts">
    import type Member from "$lib/sb/Member";
    import Srvbench from "$lib/sb/Srvbench";
    import * as Table from "$lib/components/ui/table";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import { Loader2 } from "lucide-svelte";
    import IntersectionObserver from "svelte-intersection-observer";
    import Frappe from "$lib/components/serverbench/chart/Chartjs.svelte";
    import Chartjs from "$lib/components/serverbench/chart/Chartjs.svelte";
    import type Stat from "$lib/sb/stat/Stat";

    let page = 0;
    let rank: number | null = null;
    let members: Member[] = [];

    let activityStat: Stat | null = null;
    let retentionSpanStat: Stat | null = null;
    let newReturningStat:Stat|null = null;

    $: rank,
        (async () => {
            page = 0;
            members = [];
            await loadMembers();
        })();

    let loading: boolean = false;
    async function loadMembers() {
        if (loading) return;
        loading = true;
        let loaded: Member[] = [];
        if (rank) {
            loaded = await Srvbench.getInstance()
                .getCommunity()!
                .getMembers(page);
        } else {
            loaded = await Srvbench.getInstance()
                .getCommunity()!
                .getMembers(page);
        }
        members.push(...loaded);
        members = members;
        loading = false;
        page++;
    }

    onMount(async () => {
        let _: any;
        [activityStat, retentionSpanStat, newReturningStat, _] = await Promise.all([
            Srvbench.getInstance().getCommunity()!.getActivity(),
            Srvbench.getInstance().getCommunity()!.getRetentionSpan(),
            Srvbench.getInstance().getCommunity()!.getNewReturningMembers(),
            loadMembers(),
        ]);
    });
    let element: HTMLElement;
    let intersecting: boolean;

    $: intersecting,
        (async () => {
            if (!intersecting) return;
            await loadMembers();
        })();
</script>

<Chartjs stat={activityStat} />
<Chartjs stat={newReturningStat} />
<Chartjs stat={retentionSpanStat} log tiny />

<Card.Root>
    <Table.Root>
        <Table.Caption class="pb-3">
            <IntersectionObserver {element} bind:intersecting>
                <div bind:this={element}>
                    <Button
                        on:click={() => loadMembers()}
                        disabled={loading}
                        variant="outline"
                    >
                        {#if loading}
                            <Loader2 class="animate-spin" />
                        {:else}
                            <span> Load More </span>
                        {/if}
                    </Button>
                </div>
            </IntersectionObserver>
        </Table.Caption>
        <Table.Header>
            <Table.Row>
                <Table.Head>Player</Table.Head>
                <Table.Head class="text-right">Joined</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each members as member}
                <Table.Row>
                    <Table.Cell class="flex flex-row items-center gap-3">
                        <Avatar.Root>
                            <Avatar.Image
                                src={`https://minotar.net/helm/${member.eid}`}
                            />
                            <Avatar.Fallback>?</Avatar.Fallback>
                        </Avatar.Root>
                        <div>
                            {member.name}
                        </div>
                    </Table.Cell>
                    <Table.Cell class="text-right"
                        >{member.joined.toLocaleDateString()}</Table.Cell
                    >
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</Card.Root>
