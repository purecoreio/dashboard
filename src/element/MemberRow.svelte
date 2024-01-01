<script lang="ts">
    import type Member from "$lib/sb/Member";
    import {
        TableBodyCell,
        TableBodyRow,
        Avatar,
        Badge,
        Button,
    } from "flowbite-svelte";
    import Person from "~icons/ic/sharp-account-circle";

    export let member: Member;
</script>

<TableBodyRow>
    <TableBodyCell>
        <div class="flex flex-row items-center gap-5">
            <Avatar src={`https://minotar.net/helm/${member.name}`} />
            <div class="grow">
                <p>
                    {member.name}
                </p>
                <p class="text-xs opacity-50">
                    {member.eid}
                </p>
            </div>
            <Button color="alternative" href={`/community/community/members/${member.id}`}>
                <Person/>
            </Button>
        </div>
    </TableBodyCell>
</TableBodyRow>
