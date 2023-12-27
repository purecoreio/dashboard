<script lang="ts">
    import { Button, Card, Input, Label, Toggle } from "flowbite-svelte";
    import Next from "~icons/ic/round-chevron-right";
    import UnderConstruction from "~icons/fluent-emoji/construction";
    import Rocket from "~icons/fluent-emoji/rocket";

    let address: string;
    let hosted: boolean = true;
</script>

<div>
    <div class="flex flex-col gap-4">
        <Toggle bind:checked={hosted}>My server is already hosted</Toggle>
        {#if hosted}
            <div>
                <Label for="community-ip" class="block"
                    >Current Address/IP</Label
                >
                <Input
                    id="community-ip"
                    bind:value={address}
                    placeholder="IP"
                />
            </div>
        {:else}
            <Card class="max-w-full" size="lg">
                <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                    Our hosting plans are coming soon
                </h5>
                <p
                    class="font-normal text-gray-700 dark:text-gray-400 leading-tight"
                >
                    We are still working on our hosting service. Take a look
                    from time to time to see what's in store :)
                </p>
            </Card>
        {/if}
        <div class="text-right">
            <Button href="/setup/ingest">Next <Next /></Button>
        </div>
    </div>
</div>
<Card class="items-center">
    {#if hosted}
        <Rocket height="100%" width="50%" />
    {:else}
        <UnderConstruction height="100%" width="50%" />
    {/if}
</Card>
