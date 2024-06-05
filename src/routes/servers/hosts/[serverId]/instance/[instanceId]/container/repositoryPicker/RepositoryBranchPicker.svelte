<script lang="ts">
    import { toast } from "svelte-sonner";
    import * as Select from "$lib/components/ui/select/index.js";
    import type { Selected } from "bits-ui";
    import { onMount } from "svelte";
    import type Repository from "$lib/sb/developer/Repository";

    let loading = false;
    let branchSelected: Selected<string> = {
        value: "",
    };
    let branches: string[] = [];
    export let repository: Repository | null = null;
    export let branch: string | null = null;

    $: repository, updateBranches();
    $: branchSelected,
        (() => {
            branch = branches.find((b) => b == branchSelected.value)
                ? branchSelected.value
                : null;
        })();

    async function updateBranches() {
        loading = true;
        try {
            branches = (await repository?.getBranches()) ?? [];
            branchSelected = {
                value: "",
            };
        } catch (error) {
            toast.error("unable to load branches");
        }
        loading = false;
    }

    onMount(async () => {
        await updateBranches();
    });
</script>

<Select.Root
    disabled={loading || repository == null}
    bind:selected={branchSelected}
    portal={null}
>
    <Select.Trigger>
        <Select.Value placeholder="Select a branch" />
    </Select.Trigger>
    <Select.Content class="overflow-y-auto max-h-80">
        <Select.Group>
            <Select.Label>Branch</Select.Label>
            {#each branches as branch}
                <Select.Item
                    class="flex flex-row gap-2 items-center"
                    value={branch}
                    label={branch}
                >
                    {branch}
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
    <Select.Input name="repository" />
</Select.Root>
