<script lang="ts">
    import type Member from "$lib/sb/Member";
    import Srvbench from "$lib/sb/Srvbench";
    import { Search, ListPlaceholder, Table, TableBody } from "flowbite-svelte";
    import MemberRow from "./MemberRow.svelte";
    import Nerd from "~icons/fluent-emoji/nerd-face";

    export let member: Member | null = null;
    let showResults = false;
    let loadingResults = false;
    let lastKey: number | null = null;
    let username: string;

    async function updateResults() {
        loadingResults = true;
        const now = new Date();
        lastKey = now.getTime();
        try {
            console.log('?')
            if (!member || member.name != username) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                if (lastKey && lastKey == now.getTime()) {
                    member = await Srvbench.getInstance()
                        .getCommunity()!
                        .searchMember(username);
                }
            }
        } catch (error) {
            member = null;
        }
        loadingResults = false;
    }
</script>

<div class="relative w-full z-20">
    <Search
        on:focus={() => (showResults = true)}
        on:blur={() => (showResults = false)}
        on:keyup={updateResults}
        bind:value={username}
        class="input-focus-listener"
        placeholder="search member..."
    />
    <div
        class:opacity-0={!showResults}
        class="absolute left-0 w-full focus-div dark:bg-gray-700 bg-neutral-50 ring-1 ring-black ring-opacity-10 rounded overflow-hidden shadow-md transition-all"
    >
        {#if loadingResults}
            <div class="p-5">
                <ListPlaceholder divClass="max-w-full" />
            </div>
        {:else if member}
            <Table>
                <TableBody>
                    <MemberRow {member} />
                </TableBody>
            </Table>
        {:else}
            <div class="py-5">
                <Nerd width="100%" height={40} />
            </div>
        {/if}
    </div>
</div>
