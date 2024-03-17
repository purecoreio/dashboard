<script lang="ts">
    import { page } from "$app/stores";
    export let categories: Record<string, any>,
        currentCategory: string | null,
        base: string;
</script>

{#each Object.keys(categories ?? {}) as category}
    <a
        href={`${base}/${category}/${categories[category].options[0]}`}
        class:bg-primary={currentCategory == category}
        class:text-white={currentCategory == category}
        class:dark:text-black={currentCategory == category}
        class:bg-black={currentCategory != category}
        class:dark:bg-white={currentCategory != category}
        class:bg-opacity-0={currentCategory != category}
        class:dark:bg-opacity-0={currentCategory != category}
        class:hover:bg-opacity-5={currentCategory != category}
        class:dark:hover:bg-opacity-10={currentCategory != category}
        class="flex flex-row gap-3 rounded-md items-center transition capitalize justify-center xl:justify-normal aspect-square xl:aspect-auto xl:px-3 xl:py-3.5"
    >
        <svelte:component this={categories[category].icon} class="w-5 h-5" />
        <span class="hidden xl:block">{category}</span>
    </a>
{/each}
