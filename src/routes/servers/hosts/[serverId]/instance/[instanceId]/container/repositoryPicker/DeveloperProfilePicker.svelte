<script lang="ts">
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";
    import type DeveloperProfile from "$lib/sb/developer/DeveloperProfile";
    import Srvbench from "$lib/sb/Srvbench";
    import type { Selected } from "bits-ui";
    import { onMount } from "svelte";

    let loading = false;
    let developerProfileSelected: Selected<string> = {
        value: "",
    };
    let developerProfiles: DeveloperProfile[] = [];
    export let developerProfile: DeveloperProfile | null = null;
    $: developerProfileSelected,
        (() => {
            developerProfile =
                developerProfiles.find(
                    (d) => d.id == developerProfileSelected.value,
                ) ?? null;
        })();

    async function updateProfiles() {
        loading = true;
        try {
            developerProfiles = await Srvbench.getInstance()
                .getUser()
                .getDeveloperProfiles();
        } catch (error) {
            toast.error("unable to load developer profiles");
        }
        loading = false;
    }

    onMount(async () => {
        await updateProfiles();
    });
</script>

<Select.Root
    disabled={loading}
    bind:selected={developerProfileSelected}
    portal={null}
>
    <Select.Trigger>
        <Select.Value placeholder="Select a developer profile" />
    </Select.Trigger>
    <Select.Content>
        <Select.Group>
            <Select.Label>Developer Profile</Select.Label>
            {#each developerProfiles as profile}
                <Select.Item value={profile.id} label={profile.username}
                    >{profile.username}@{profile.platform}
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
    <Select.Input name="developerProfile" />
</Select.Root>
