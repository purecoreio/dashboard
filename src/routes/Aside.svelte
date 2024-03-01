<script lang="ts">
    import { page } from "$app/stores";

    export let height: number, categories: Record<string, any>;

    $: current = Object.keys(categories).find(
        (m) => m == $page.url.pathname.split("/")[1],
    );

    let aside: HTMLElement;

    export let width: number = 0;
    $: aside?.offsetHeight,
        (() => {
            width = aside?.offsetWidth;
        })();
</script>

<aside
    bind:this={aside}
    class="h-screen hidden xl:flex flex-col fixed top-0 left-0 w-full max-w-64 border-r-[1px] px-3 gap-2 pt-4 bg-white dark:bg-black dark:border-neutral-900 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-lg z-50"
    style={`margin-top:${height}px;`}
>
    {#each Object.keys(categories) as category}
        <a
            href={`/${category}`}
            class:bg-primary={current == category}
            class:text-white={current == category}
            class:dark:text-black={current == category}
            class:bg-black={current != category}
            class:dark:bg-white={current != category}
            class:bg-opacity-0={current != category}
            class:dark:bg-opacity-0={current != category}
            class:hover:bg-opacity-5={current != category}
            class:dark:hover:bg-opacity-10={current != category}
            class="flex flex-row gap-3 px-3 py-3.5 rounded-md items-center transition capitalize"
        >
            <svelte:component this={categories[category]} class="w-5 h-5" />
            {category}
        </a>
    {/each}
</aside>
