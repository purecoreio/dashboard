<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Member from "$lib/sb/Member";
    import MemberRow from "../../../../../element/MemberRow.svelte";
    import {
        Avatar,
        Badge,
        Card,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import Rank from "$lib/sb/Rank";
    import Chart from "../../../../../element/Chart.svelte";
    import RankChart from "./RankChart.svelte";

    let member: Member | null = null;
    let ranks: Rank[] | null = null;

    onMount(async () => {
        member = await Srvbench.getInstance()
            .getCommunity()!
            .getMember($page.params.id);
        ranks = await member.getRanks();
    });
</script>

{#if member}
    <Card class="max-w-full">
        <div class="flex flex-row gap-5 items-center">
            <Avatar src={`https://minotar.net/helm/${member.eid}`} />
            <div>
                <h1 class="text-black dark:text-white font-semibold text-xl">
                    {member.name}
                </h1>
                <div>
                    {#each member.names as name}
                        <Badge>
                            {name.value}
                            {name.created.toLocaleDateString()}
                        </Badge>
                    {/each}
                </div>
            </div>
        </div>
    </Card>
    <Card class="max-w-full">
        <Table>
            <TableBody>
                <TableBodyRow>
                    <TableBodyCell>Game</TableBodyCell>
                    <TableBodyCell>{member.game}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Game ID</TableBodyCell>
                    <TableBodyCell>{member.eid}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Community ID</TableBodyCell>
                    <TableBodyCell>{member.id}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>First Seen</TableBodyCell>
                    <TableBodyCell
                        >{member.joined.toLocaleDateString()}</TableBodyCell
                    >
                </TableBodyRow>
            </TableBody>
        </Table>
    </Card>
    {#if ranks}
        <Card class="max-w-full">
            <RankChart {ranks} />
        </Card>
    {/if}
{/if}
