<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import Label from "$lib/components/ui/label/label.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import { Loader2, Plus } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";
    import * as Select from "$lib/components/ui/select";

    let domain: string = "";
    let handlerIdentifier: string = "";
    let handlerTypes: any[] = [];
    let cooldown: number = 0;
    let reset: number | null = null;
    let regions: string[] = [];

    let loading: boolean = false;
    let creating: boolean = false;

    const dispatch = createEventDispatcher();

    async function create() {
        loading = true;
        try {
            const site = await Srvbench.getInstance().createVotingSite(
                domain,
                handlerIdentifier,
                handlerTypes.map((t) => t.value),
                cooldown,
                reset,
                regions,
            );
            domain = "";
            handlerIdentifier = "";
            handlerTypes = [];
            cooldown = 0;
            reset = null;
            regions = [];
            dispatch("createdSite", site);
            creating = false;
        } catch (error) {}
        loading = false;
    }
</script>

<div>
    <Dialog.Root bind:open={creating}>
        <Dialog.Trigger>
            <Button class="aspect-square" variant="outline" size="icon">
                <Plus class="w-4 h-4" />
            </Button>
        </Dialog.Trigger>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>New voting site</Dialog.Title>
            </Dialog.Header>
            <div class="flex flex-col gap-3">
                <div>
                    <Label>Domain</Label>
                    <Input disabled={loading} bind:value={domain} />
                </div>
                <hr />
                <div class="grid grid-cols-2 gap-3 items-center">
                    <div>
                        <Label>Cooldown</Label>
                        <Input
                            disabled={loading}
                            bind:value={cooldown}
                            type="number"
                        />
                    </div>
                    <div>
                        <Label>Reset</Label>
                        <Input
                            disabled={loading}
                            bind:value={reset}
                            type="number"
                        />
                    </div>
                </div>
                <hr />
                <div>
                    <Label>Type</Label>
                    <Select.Root
                        multiple
                        disabled={loading}
                        bind:selected={handlerTypes}
                    >
                        <Select.Trigger>
                            <Select.Value placeholder="Type" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="Votifier">Votifier</Select.Item>
                            <Select.Item value="NuVotifier"
                                >NuVotifier</Select.Item
                            >
                        </Select.Content>
                    </Select.Root>
                </div>
                <div>
                    <Label>Identifier</Label>
                    <Input disabled={loading} bind:value={handlerIdentifier} />
                </div>
                <Button disabled={loading} on:click={() => create()}>
                    {#if loading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        Create
                    {/if}
                </Button>
            </div>
        </Dialog.Content>
    </Dialog.Root>
</div>
