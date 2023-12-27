<script lang="ts">
    import type Key from "$lib/sb/Key";
    import Srvbench from "$lib/sb/SrvBench";
    import { onMount } from "svelte";
    import Copy from "~icons/ic/baseline-content-copy";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        Card,
        Input,
        Button,
    } from "flowbite-svelte";

    let keys: Key[] = [];
    let loading = true;
    onMount(async () => {
        const sb = Srvbench.getInstance();
        keys = await sb.getCommunity()!.getKeys();
        loading = false;
    });
</script>

<Card class="max-w-full">
    <Table>
        <TableBody>
            {#each keys as key}
                <TableBodyRow>
                    <TableBodyCell tdClass="w-full">
                        <Input type="password" disabled value={key.id} />
                    </TableBodyCell>
                    <TableBodyCell>
                        <Button>
                            <Copy />
                        </Button>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Card>
