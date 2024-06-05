<script lang="ts">
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";
    import type DeveloperProfile from "$lib/sb/developer/DeveloperProfile";
    import Srvbench from "$lib/sb/Srvbench";
    import type { Selected } from "bits-ui";
    import { onMount } from "svelte";
    import Fa from "svelte-fa";
    import { faGithub } from "@fortawesome/free-brands-svg-icons";
    import type Repository from "$lib/sb/developer/Repository";

    let loading = false;
    let repositorySelected: Selected<string> = {
        value: "",
    };
    let repositories: Repository[] = [];
    export let repository: Repository | null = null;
    export let developerProfile: DeveloperProfile | null = null;
    $: repositorySelected,
        (() => {
            repository =
                repositories.find((d) => d.eid == repositorySelected.value) ??
                null;
        })();

    $: developerProfile, updateRepositories();

    async function updateRepositories() {
        loading = true;
        try {
            repositories = (await developerProfile?.getRepositories()) ?? [];
            repositorySelected = {
                value: "",
            };
        } catch (error) {
            toast.error("unable to load repositories");
        }
        loading = false;
    }

    onMount(async () => {
        await updateRepositories();
    });
</script>

<Select.Root
    disabled={loading || developerProfile == null}
    bind:selected={repositorySelected}
    portal={null}
>
    <Select.Trigger>
        <Select.Value placeholder="Select a repository" />
    </Select.Trigger>
    <Select.Content class="overflow-y-auto max-h-80">
        <Select.Group>
            <Select.Label>Repository</Select.Label>
            {#each repositories as repository}
                <Select.Item
                    class="flex flex-row gap-2 items-center"
                    value={repository.eid}
                    label={repository.name}
                >
                    {repository.name}
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
    <Select.Input name="repository" />
</Select.Root>
