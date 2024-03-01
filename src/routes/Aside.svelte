<script lang="ts">
    import Categories from "./Categories.svelte";

    export let height: number,
        categories: Record<string, any>,
        currentCategory: string | null;

    let aside: HTMLElement;

    export let width: number = 0;
    $: aside?.offsetHeight,
        (() => {
            width = aside?.offsetWidth;
        })();
</script>

<aside
    bind:this={aside}
    class="h-screen hidden lg:flex flex-col fixed top-0 left-0 w-full max-w-20 xl:max-w-64 border-r-[1px] px-3 gap-2 pt-4 bg-white dark:bg-black dark:border-neutral-900 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-lg z-50"
    style={`margin-top:${height}px;`}
>
    <Categories {categories} {currentCategory} />
</aside>
