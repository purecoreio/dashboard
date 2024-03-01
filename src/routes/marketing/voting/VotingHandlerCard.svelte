<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import NuVotifierHandler from "$lib/sb/votingSettings/handler/NuVotifierHandler";
    import VotifierHandler from "$lib/sb/votingSettings/handler/VotifierHandler";
    export let handler: NuVotifierHandler | VotifierHandler;
</script>

<Card.Root class="p-3 flex flex-col gap-3">
    <div class="flex flex-row gap-3">
        <div class="grow">
            <Label for="shard">Address</Label>
            <Input
                id="shard"
                disabled
                value={`${handler.shard}.v.serverbench.io`}
            />
        </div>
        <div class="max-w-20">
            <Label for="port">Port</Label>
            <Input id="port" disabled value={handler.port} />
        </div>
    </div>
    {#if handler instanceof VotifierHandler}
        <div class="flex flex-row gap-3">
            <div class="grow">
                <Label for="rsa1024Pk">RSA 1024 Public</Label>
                <Input
                    id="rsa1024Pk"
                    disabled
                    value={handler.rsa1024Pk}
                    type="password"
                />
            </div>
            <div class="grow">
                <Label for="rsa1024Sk">RSA 1024 Secret</Label>
                <Input
                    id="rsa1024Sk"
                    disabled
                    value={handler.rsa1024Sk}
                    type="password"
                />
            </div>
        </div>
        <div class="flex flex-row gap-3">
            <div class="grow">
                <Label for="rsa2048Pk">RSA 2048 Public</Label>
                <Input
                    id="rsa2048Pk"
                    disabled
                    value={handler.rsa2048Pk}
                    type="password"
                />
            </div>
            <div class="grow">
                <Label for="rsa2048Sk">RSA 2048 Secret</Label>
                <Input
                    id="rsa2048Sk"
                    disabled
                    value={handler.rsa2048Sk}
                    type="password"
                />
            </div>
        </div>
    {:else if handler instanceof NuVotifierHandler}
        <div>
            <Label for="p1024">Token</Label>
            <Input
                id="token"
                disabled
                value={handler.token}
                type="password"
            />
        </div>
    {/if}
</Card.Root>
