<script lang="ts">
    import type Invite from "$lib/sb/Invite";
    import type Role from "$lib/sb/Role";
    import Srvbench from "$lib/sb/Srvbench";
    import { onMount } from "svelte";
    import Empty from "~icons/fluent-emoji/open-mailbox-with-lowered-flag";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Modal,
        ListPlaceholder,
        Button,
        Card,
        Input,
    } from "flowbite-svelte";
    import MemberSelect from "../../../../element/MemberSelect.svelte";
    import type Member from "$lib/sb/Member";

    let roles: Role[] = [];
    let loadingRoles = false;

    let invites: Invite[] = [];
    let loadingInvites = false;

    onMount(async () => {
        await Promise.all([loadRoles(), loadInvites()]);
    });

    async function loadRoles() {
        loadingRoles = true;
        try {
            roles = await Srvbench.getInstance().getCommunity()!.getRoles();
        } catch (error) {}
        loadingRoles = false;
    }

    async function loadInvites() {
        loadingInvites = true;
        try {
            invites = await Srvbench.getInstance().getCommunity()!.getInvites();
        } catch (error) {}
        loadingInvites = false;
    }

    let roleInviteTarget: Role | null = null;
    let inviteModal: boolean = false;
    let creatingInvite: boolean = false;
    let memberTarget: Member | null;

    async function inviteStaff() {
        creatingInvite = true;
        try {
            await Srvbench.getInstance()
                .getCommunity()!
                .createInvite(roleInviteTarget!, memberTarget!);
            inviteModal = false;
            await loadInvites();
        } catch (error) {}
        creatingInvite = false;
    }
</script>

<Modal
    title={`${roleInviteTarget?.name} invite`}
    bind:open={inviteModal}
    dismissable={false}
>
    <div class="h-48">
        <MemberSelect bind:member={memberTarget} />
    </div>
    <svelte:fragment slot="footer">
        <div class="flex flex-row justify-between w-full">
            <Button
                disabled={creatingInvite}
                on:click={() => (inviteModal = false)}
                color="alternative">Close</Button
            >
            <Button disabled={creatingInvite} on:click={inviteStaff}
                >Create Invite</Button
            >
        </div>
    </svelte:fragment>
</Modal>

<Card class="max-w-full flex flex-col gap-3">
    <div class="flex flex-row items-center justify-between">
        <h1 class="text-black font-semibold">Roles</h1>
        {#if roles.length > 0}
            <Button
                href="/community/settings/staff/role/new"
                size="sm"
                color="alternative">Create</Button
            >
        {/if}
    </div>
    {#if loadingRoles}
        <ListPlaceholder divClass="max-w-full" />
    {:else if roles.length <= 0}
        <div class="py-10 flex flex-col gap-5 items-center justify-center">
            <Empty height={75} width="100%" />
            <Button href="/community/settings/staff/role/new">
                Create Role
            </Button>
        </div>
    {:else}
        <div class="ring-1 ring-opacity-10 ring-black rounded overflow-hidden">
            <Table>
                <TableHead>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell class=" text-center"
                        >Permissions</TableHeadCell
                    >
                    <TableHeadCell>Invite</TableHeadCell>
                </TableHead>
                <TableBody>
                    {#each roles as role}
                        <TableBodyRow>
                            <TableBodyCell>{role.name}</TableBodyCell>
                            <TableBodyCell tdClass="w-full text-center"
                                >{role.permissions.join(", ")}</TableBodyCell
                            >
                            <TableBodyCell>
                                <Button
                                    href="#"
                                    on:click={() => {
                                        roleInviteTarget = role;
                                        inviteModal = true;
                                    }}>Invite</Button
                                >
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
    {/if}
</Card>
<Card class="max-w-full flex flex-col gap-3">
    <h1 class="text-black font-semibold">Invites</h1>
    {#if loadingInvites}
        <ListPlaceholder divClass="max-w-full" />
    {:else}
        <div class="ring-1 ring-opacity-10 ring-black rounded overflow-hidden">
            <Table>
                <TableHead>
                    <TableHeadCell>Member</TableHeadCell>
                    <TableHeadCell>Role</TableHeadCell>
                    <TableHeadCell>Id</TableHeadCell>
                </TableHead>
                <TableBody>
                    {#each invites as invite}
                        <TableBodyRow>
                            <TableBodyCell>{invite.member.name}</TableBodyCell>
                            <TableBodyCell>
                                {invite.role.name}
                            </TableBodyCell>
                            <TableBodyCell>
                                <Input value={invite.id} />
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
    {/if}
</Card>
