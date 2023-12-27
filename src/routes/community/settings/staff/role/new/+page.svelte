<script lang="ts">
    import { goto } from "$app/navigation";
    import Srvbench from "$lib/sb/Srvbench";
    import { Button, Card, Input, Label, MultiSelect } from "flowbite-svelte";
    const items = [
        {
            value: "read_chat",
            name: "Read Chat",
        },
    ];

    let permissions: string[] = [];
    let roleName: string;
    let loading = false;

    async function createRole() {
        loading = true;
        try {
            await Srvbench.getInstance()
                .getCommunity()!
                .createRole(roleName, permissions);
            goto("/community/settings/staff");
        } catch (error) {}
        loading = false;
    }
</script>

<Card class="max-w-full flex flex-col gap-5">
    <div>
        <Label for="role-name">Role Name</Label>
        <Input
            disabled={loading}
            bind:value={roleName}
            id="role-name"
            placeholder="moderator"
        />
    </div>
    <MultiSelect disabled={loading} {items} bind:value={permissions} />
    <div class="flex flex-row justify-between">
        <Button
            disabled={loading}
            href="/community/settings/staff"
            color="alternative"
        >
            Cancel
        </Button>
        <Button disabled={loading} href="#" on:click={() => createRole()}
            >Create</Button
        >
    </div>
</Card>
