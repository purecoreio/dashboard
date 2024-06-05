<script lang="ts">
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";
    import type DeveloperProfile from "$lib/sb/developer/DeveloperProfile";
    import Srvbench from "$lib/sb/Srvbench";
    import type { Selected } from "bits-ui";
    import { onMount } from "svelte";
    import Fa from "svelte-fa";
    import { faGithub } from "@fortawesome/free-brands-svg-icons";
    import { Button } from "$lib/components/ui/button";
    import { Plus } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import type { DevelopmentPlatform } from "$lib/sb/developer/DeveloperProfile";

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

    async function link(platform: DevelopmentPlatform) {
        loading = true;
        try {
            const user = Srvbench.getInstance().getUser();
            await user.linkDeveloperProfile(platform);
            const newProfiles = await user.getDeveloperProfiles();
            let newId: string | null = null;
            for (const profile of newProfiles) {
                if (!developerProfiles.find((d) => d.id == profile.id)) {
                    newId = profile.id;
                    break;
                }
            }
            developerProfiles = newProfiles;
            if (newId) {
                developerProfileSelected = {
                    value: newId,
                };
            }
        } catch (error) {}
        loading = false;
    }

    onMount(async () => {
        await updateProfiles();
    });
</script>

<div class="flex flex-row gap-2 items-center">
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
                    <Select.Item
                        class="flex flex-row gap-2 items-center"
                        value={profile.id}
                        label={profile.username}
                    >
                        {#if profile.platform == "github"}
                            <Fa icon={faGithub} />
                        {/if}
                        {profile.username}
                    </Select.Item>
                {/each}
            </Select.Group>
        </Select.Content>
        <Select.Input name="developerProfile" />
    </Select.Root>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="outline"
                size="icon"
                class="aspect-square"
            >
                <Plus class="w-4 h-4" />
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
            <DropdownMenu.Label>Link Developer Profile</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
                on:click={() => link("github")}
                class="flex flex-row items-center gap-2"
            >
                <Fa icon={faGithub} />
                GitHub
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>
