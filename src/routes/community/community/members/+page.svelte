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

    onMount(async () => {
        await getMembers();
    });
</script>

<div class="flex flex-row justify-between">
    <div>
        <Button disabled={loading} color="alternative">
            <Filter />
        </Button>
        <Dropdown class="w-56 p-3 space-y-1">
            <DropdownItem>
                <Select items={activityFilters} bind:value={selectedActivity} />
            </DropdownItem>
        </Dropdown>
    </div>
</div>

<MemberSelect />

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
