<script lang="ts">
    import { goto } from "$app/navigation";
    import Waving from "~icons/fluent-emoji/waving-hand";
    import Hundred from "~icons/fluent-emoji/hundred-points";
    import { Label, Input, Button } from "flowbite-svelte";
    import type Staff from "$lib/sb/Staff";
    import Srvbench from "$lib/sb/Srvbench";
    import type Community from "$lib/sb/Community";
    let invite: string;
    let loading = false;
    let staff: Staff | null = null;

    async function join() {
        loading = true;
        try {
            staff = await Srvbench.getInstance().joinCommunity(invite);
        } catch (error) {
            loading = false;
        }
    }

    function goToCommunity() {
        Srvbench.getInstance().setCommunity(staff!.community);
        goto("/community/moderation/chat");
    }
</script>

<div>
    <div class="flex flex-col gap-4">
        {#if staff}
            <Hundred width="100%" height={75} />
            <div class="text-center">
                <h3 class="font-semibold text-3xl">heya,</h3>
                <h1 class="font-black text-4xl">{staff.member.name}!</h1>
            </div>
            <div class="text-center">
                <Button href="#" on:click={() => goToCommunity()}
                    >Go To {staff.community.name}</Button
                >
            </div>
        {:else}
            <Waving width="100%" height={75} />
            <div>
                <Label for="invite-id" class="block">Invite Id</Label>
                <Input
                    disabled={loading}
                    id="invite-id"
                    bind:value={invite}
                    placeholder="00000000-0000-0000-0000-000000000000"
                />
            </div>
            <Button disabled={loading} href="#" on:click={join}>Join</Button>
            <Button disabled={loading} href="/" color="alternative"
                >Cancel</Button
            >
        {/if}
    </div>
</div>
