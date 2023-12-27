<script lang="ts">
    import Member from "$lib/sb/Member";
    import Srvbench from "$lib/sb/Srvbench";
    import { onMount } from "svelte";
    import Search from "~icons/ic/baseline-person-search";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Checkbox,
        TableSearch,
        Card,
        ListPlaceholder,
        Spinner,
        Input,
        Label,
        Button,
    } from "flowbite-svelte";
    import MemberRow from "../../../../element/MemberRow.svelte";
    import IntersectionObserver from "svelte-intersection-observer";

    let intersector: HTMLDivElement;
    let page = 0;
    let loading = false;
    let members: Member[] = [];

    async function getMembers() {
        if (page == -1) return;
        if (loading) return;
        loading = true;
        const addedMembers = await Srvbench.getInstance()
            .getCommunity()!
            .getMembers(page);
        members.push(...addedMembers);
        members = members;
        page++;
        loading = false;
        if (addedMembers.length < 20) page = -1;
    }

    onMount(async () => {
        await getMembers();
    });

    let usernameSearch: string;
    let loadingSearch = false;
    let searchResult: Member | null = null;

    async function searchPlayer() {
        loadingSearch = true;
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            searchResult = await Srvbench.getInstance()
                .getCommunity()!
                .searchMember(usernameSearch);
        } catch (error) {
            searchResult = null;
        }
        loadingSearch = false;
    }
</script>

<IntersectionObserver
    element={intersector}
    on:observe={async (e) => {
        await getMembers();
    }}
></IntersectionObserver>

<Card class="max-w-full flex flex-row gap-5">
    <Input
        disabled={loadingSearch}
        bind:value={usernameSearch}
        placeholder="username"
    ></Input>
    <Button disabled={loadingSearch} on:click={() => searchPlayer()}>
        <Search />
    </Button>
</Card>

{#if searchResult}
    <Card class="max-w-full">
        <div
            class:opacity-50={loadingSearch}
            class:blur-sm={loadingSearch}
            class="transition-all"
        >
            <Table>
                <TableBody>
                    <MemberRow member={searchResult} />
                </TableBody>
            </Table>
        </div>
    </Card>
{/if}

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
    {#if page > 0 && !loading}
        <div bind:this={intersector} />
    {/if}
{:else if loading}
    <ListPlaceholder class="max-w-full" />
{/if}
