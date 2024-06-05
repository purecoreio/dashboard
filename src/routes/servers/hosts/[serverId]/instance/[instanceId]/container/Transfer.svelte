<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        ClipboardCopy,
        Globe,
        HardDrive,
        Loader2,
        MoveLeft,
        MoveRight,
        Rss,
    } from "lucide-svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import Input from "$lib/components/ui/input/input.svelte";
    import { toast } from "svelte-sonner";
    import type Container from "$lib/sb/server/Container";
    import copyTextToClipboard from "copy-text-to-clipboard";
    import Label from "$lib/components/ui/label/label.svelte";
    import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import Badge from "$lib/components/ui/badge/badge.svelte";

    let loading = false;
    export let transfer: boolean;
    export let container: Container | null;

    let password: string | null = null;
    let port: number = 22;
    let address: string | null = null;
    let path: string | null = null;
    let user: string | null = null;
    let usePassword: boolean = false;
    let mirror: boolean = false;
    let out: boolean = false;

    async function startTransfer() {
        loading = true;
        try {
            await container?.transfer(
                out,
                address!,
                user!,
                path!,
                mirror,
                port,
                usePassword ? password : null,
            );
            out = false;
            password = null;
            port = 22;
            address = null;
            path = null;
            usePassword = false;
            mirror = false;
            loading = false;
            transfer = false;
        } catch (error) {}
        loading = false;
    }
</script>

{#if container}
    <Dialog.Root bind:open={transfer}>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Transfer Data</Dialog.Title>
            </Dialog.Header>
            <div class="flex flex-col gap-2">
                <Card.Root
                    class="p-2 flex flex-row gap-2 items-center text-center"
                >
                    <div class="grow py-5 flex flex-col gap-2">
                        <HardDrive class="mx-auto" />
                        local
                        <div>
                            <Badge>
                                {#if out}
                                    From
                                {:else}
                                    To
                                {/if}
                            </Badge>
                        </div>
                    </div>
                    <Button on:click={() => (out = !out)} size="icon">
                        {#if out}
                            <MoveRight class="w-4 h-4" />
                        {:else}
                            <MoveLeft class="w-4 h-4" />
                        {/if}
                    </Button>
                    <div class="grow py-5 flex flex-col gap-2">
                        <Rss class="mx-auto" />
                        remote
                        <div>
                            <Badge>
                                {#if !out}
                                    From
                                {:else}
                                    To
                                {/if}
                            </Badge>
                        </div>
                    </div>
                </Card.Root>
                <div class="flex flex-row gap-2">
                    <div>
                        <Label>Address</Label>
                        <Input
                            id="address"
                            type="text"
                            disabled={loading}
                            bind:value={address}
                        />
                    </div>
                    <div>
                        <Label>Port</Label>
                        <Input
                            id="port"
                            type="number"
                            disabled={loading}
                            bind:value={port}
                        />
                    </div>
                </div>
                <div>
                    <Label>Path</Label>
                    <Input
                        id="path"
                        type="path"
                        disabled={loading}
                        bind:value={path}
                    />
                </div>
                <div>
                    <Label>User</Label>
                    <Input
                        id="user"
                        type="user"
                        disabled={loading}
                        bind:value={user}
                    />
                </div>
                <div class="flex items-center space-x-2 my-1">
                    <Checkbox
                        id="usepassword"
                        bind:checked={usePassword}
                        disabled={loading}
                    />
                    <Label for="usepassword" class="text-sm font-medium">
                        Use password instead of SSH key-based authentication
                    </Label>
                </div>
                <div class="flex items-center space-x-2 my-1">
                    <Checkbox
                        id="mirror"
                        bind:checked={mirror}
                        disabled={loading}
                    />
                    <Label
                        for="mirror"
                        class="text-sm font-medium text-red-400"
                    >
                        Mirror data, deleting target files that do not exist on
                        the source
                    </Label>
                </div>
                {#if usePassword}
                    <div>
                        <Label>Password</Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={loading}
                            bind:value={password}
                        />
                    </div>
                {/if}
            </div>
            <Dialog.Footer>
                <Button variant="secondary" on:click={() => (transfer = false)}
                    >Close</Button
                >
                <Button on:click={() => startTransfer()}>Transfer</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}
