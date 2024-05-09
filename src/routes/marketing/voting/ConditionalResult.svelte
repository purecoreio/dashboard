<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import * as ToggleGroup from "$lib/components/ui/toggle-group";
    export let operator: "eq" | "ne" | "gt" | "lt" | undefined,
        result: string | null,
        disabled: boolean;
    $: operator,
        (() => {
            if (!operator) operator = "eq";
        })();
</script>

<div class="flex flex-row items-center gap-1">
    <ToggleGroup.Root
        {disabled}
        bind:value={operator}
        variant="outline"
        type="single"
    >
        <ToggleGroup.Item value="eq">=</ToggleGroup.Item>
        <ToggleGroup.Item value="ne">≠</ToggleGroup.Item>
        <ToggleGroup.Item value="gt">&gt;</ToggleGroup.Item>
        <ToggleGroup.Item value="lt">&lt;</ToggleGroup.Item>
    </ToggleGroup.Root>
    <Input {disabled} bind:value={result} />
</div>
