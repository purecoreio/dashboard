<script lang="ts">
    let creatingOption: string | null = null;
    import { ArrowLeft } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import Srvbench from "$lib/sb/Srvbench";
    import { createEventDispatcher } from "svelte";
    export let force: boolean, creating: boolean;
    const dispatch = createEventDispatcher();

    const srvbench = Srvbench.getInstance();

    $: creating,
        (() => {
            if (force) creating = true;
        })();

    let loading = false;
    let invite: string;
    let name: string;
    let cname: string;

    async function joinCommunity() {
        loading = true;
        try {
            const staff = await srvbench.joinCommunity(invite);
            dispatch("community", staff.community);
        } catch (error) {}
        loading = false;
    }

    async function createCommunity() {
        loading = true;
        try {
            const community = await srvbench.createCommunity(name, cname);
            dispatch("community", community);
        } catch (error) {}
        loading = false;
    }
</script>

<AlertDialog.Root
    bind:open={creating}
    closeOnOutsideClick={!force}
    closeFocus={!force}
    closeOnEscape={!force}
>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Welcome to serverbench!</AlertDialog.Title>
            <AlertDialog.Description>
                {#if creatingOption == null}
                    <div>
                        You are about to create or join a community. serverbench
                        is currently in alpha, being developed by @quiquelhappy
                    </div>
                {:else if creatingOption == "create"}
                    <div class="flex flex-col gap-3">
                        <div>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                bind:value={name}
                                id="name"
                                placeholder="A very cool place"
                            />
                        </div>
                        <div>
                            <Label for="name">Subdomain</Label>
                            <div class="flex flex-row gap-3">
                                <Input
                                    bind:value={cname}
                                    type="text"
                                    id="name"
                                    placeholder="averycoolplace"
                                />
                                <Input disabled value=".serverbench.io" />
                            </div>
                        </div>
                    </div>
                {:else if creatingOption == "invite"}
                    <Label for="invite-id">Invite Id</Label>
                    <Input
                        id="invite-id"
                        bind:value={invite}
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                {/if}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            {#if creatingOption == null}
                <Button
                    variant="secondary"
                    on:click={() => (creatingOption = "create")}
                    >Create a new community</Button
                >
                <Button on:click={() => (creatingOption = "invite")}
                    >I have an invite</Button
                >
            {:else}
                <Button
                    class="mr-auto"
                    variant="ghost"
                    on:click={() => (creatingOption = null)}
                >
                    <ArrowLeft class="w-4 h-4" />
                </Button>
                {#if creatingOption == "invite"}
                    <Button on:click={() => joinCommunity()}>Join</Button>
                {:else if creatingOption == "create"}
                    <Button on:click={() => createCommunity()}>Create</Button>
                {/if}
            {/if}
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
