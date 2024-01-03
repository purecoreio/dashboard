<script lang="ts">
    import Member from "$lib/sb/Member";
    import Srvbench from "$lib/sb/Srvbench";
    import { onMount } from "svelte";
    import Filter from "~icons/ic/baseline-filter-alt";
    import {
        Table,
        TableBody,
        Card,
        ListPlaceholder,
        Spinner,
        Button,
        Dropdown,
        DropdownItem,
        Select,
    } from "flowbite-svelte";
    import MemberRow from "../../../../element/MemberRow.svelte";
    import MemberSelect from "../../../../element/MemberSelect.svelte";
    import type NewMembers from "$lib/sb/stat/NewMembers";
    import NewMembersChart from "./NewMembersChart.svelte";
    import NewMembersPieChart from "./NewMembersPieChart.svelte";
    import type Playtime from "$lib/sb/stat/Playtime";
    import PlaytimeDistributionChart from "./PlaytimeDistributionChart.svelte";
    import type ModerationCoverage from "$lib/sb/stat/ModerationCoverage";
    import ModerationCoverageChart from "./ModerationCoverageChart.svelte";

    const activityFilters: {
        value: number;
        name: string;
    }[] = [];

    for (let i = 0; i < 21; i++) {
        activityFilters.push({
            value: i == 0 ? 1 : i * 5,
            name: `≥ ${i ? i * 5 : 1}%`,
        });
    }

    let selectedActivity: number | null = null;

    $: selectedActivity,
        (() => {
            members = [];
            page = 0;
            getMembers();
        })();

    let page = 0;
    let loading = false;
    let members: Member[] = [];

    async function getMembers() {
        if (page == -1) return;
        if (loading) return;
        loading = true;
        const community = Srvbench.getInstance().getCommunity()!;
        let addedMembers: Member[] = [];
        if (selectedActivity) {
            addedMembers = await community.getMembersByRank(
                page,
                selectedActivity,
            );
        } else {
            addedMembers = await community.getMembers(page);
        }
        members.push(...addedMembers);
        members = members;
        page++;
        loading = false;
        if (addedMembers.length < 20) page = -1;
    }

    let newMembers: NewMembers[] | null = null;
    let playtimes: Playtime[] | null = null;
    let moderationCoverage: ModerationCoverage | null = null;

    onMount(async () => {
        await getMembers();
        newMembers = await Srvbench.getInstance()
            .getCommunity()!
            .getNewMembers();
        playtimes = await Srvbench.getInstance().getCommunity()!.getPlaytimes();
        moderationCoverage = await Srvbench.getInstance()
            .getCommunity()!
            .getModerationCoverage();
    });
</script>

{#if moderationCoverage != null}
    <div class="flex flex-row gap-5">
        <Card class="max-w-full grow">
            <ModerationCoverageChart coverage={moderationCoverage} />
        </Card>
    </div>
{/if}

{#if newMembers != null}
    <div class="flex flex-row gap-5">
        <Card class="max-w-full grow">
            <NewMembersChart {newMembers} />
        </Card>
        <Card class="max-w-full">
            <NewMembersPieChart
                earliestNewMembers={newMembers[newMembers.length - 1]}
                latestNewMembers={newMembers[0]}
            />
        </Card>
    </div>
{/if}

{#if playtimes != null}
    <Card class="max-w-full">
        <PlaytimeDistributionChart {playtimes} />
    </Card>
{/if}

<div class="flex flex-row items-center gap-5">
    <MemberSelect />
    <div>
        <Button size="xl" disabled={loading} color="alternative">
            <Filter />
        </Button>
        <Dropdown class="w-56 p-3 space-y-1">
            <DropdownItem>
                <Select items={activityFilters} bind:value={selectedActivity} />
            </DropdownItem>
        </Dropdown>
    </div>
</div>

{#if members.length > 0}
    <Card class="max-w-full">
        <Table>
            <TableBody>
                {#each members as member}
                    <MemberRow {member} />
                {/each}
            </TableBody>
        </Table>
        {#if loading}
            <div class="text-center py-20">
                <Spinner />
            </div>
        {/if}
    </Card>
{:else if loading}
    <ListPlaceholder class="max-w-full" />
{/if}
{#if page >= 0}
    <Button disabled={loading} on:click={getMembers}>Load More</Button>
{/if}
