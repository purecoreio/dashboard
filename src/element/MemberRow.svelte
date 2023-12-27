<script lang="ts">
    import type Member from "$lib/sb/Member";
    import { TableBodyCell, TableBodyRow, Avatar, Badge } from "flowbite-svelte";

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
            <Badge>
                {member.joined.toLocaleDateString()}
            </Badge>
        </div>
    </TableBodyCell>
</TableBodyRow>
