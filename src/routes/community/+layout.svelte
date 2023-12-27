<script>
    import { page } from "$app/stores";
    import {
        SidebarWrapper,
        Sidebar,
        SidebarGroup,
        SidebarItem,
        Button,
    } from "flowbite-svelte";

    import servers from "~icons/solar/server-bold";
    import gavel from "~icons/fluent/gavel-24-filled";
    import basket from "~icons/material-symbols/shopping-basket";
    import people from "~icons/ion/people-circle";
    import internet from "~icons/iconoir/internet";
    import command from "~icons/mdi/apple-keyboard-command";
    import settings from "~icons/ic/baseline-settings";
    import { onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import { goto } from "$app/navigation";

    const tools = [
        {
            name: "servers",
            icon: servers,
            options: ["list", "events", "spending"],
        },
        {
            name: "moderation",
            icon: gavel,
            options: ["chat", "punishments", "reports", "support"],
        },
        {
            name: "monetization",
            icon: basket,
            options: [
                "transactions",
                "subscriptions",
                "packages",
                "gateways",
                "sales",
                "coupons",
                "referrals",
            ],
        },
        {
            name: "community",
            icon: people,
            options: ["members", "analytics", "events", "news", "hooks"],
        },
        {
            name: "website",
            icon: internet,
            options: ["pages", "visitors", "design", "settings"],
        },
        {
            name: "development",
            icon: command,
            options: ["bugs"],
        },
        {
            name: "settings",
            icon: settings,
            options: ["keys", "identity", "delete", "staff"],
        },
    ];
    $: activeUrl = $page.url.pathname;
    $: activeTool = tools.find((t) =>
        activeUrl.startsWith("/community/" + t.name),
    );

    let loading = true;
    onMount(async () => {
        const srv = Srvbench.getInstance();
        try {
            await srv.restoreCommunity();
        } catch (error) {}
        if (!srv.getCommunity()) goto("/");
        loading = false;
    });
</script>

<div class="grid-cols-4 h-screen grid">
    <Sidebar {activeUrl} asideClass="w-64 border-r-2 f-full md:block hidden">
        <SidebarWrapper
            divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800"
        >
            <SidebarGroup>
                {#each tools as tool}
                    <SidebarItem
                        active={activeTool == tool}
                        href={`/community/${tool.name}/${tool.options[0]}`}
                        spanClass="py-1 capitalize"
                        label={tool.name}
                    >
                        <svelte:fragment slot="icon">
                            <svelte:component this={tool.icon} class="mr-2" />
                        </svelte:fragment>
                    </SidebarItem>
                {/each}
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
    {#if !loading}
        <div class="col-span-4 md:col-span-2 mx-2 py-5">
            <div class="w-full mx-auto flex flex-col gap-5 max-w-4xl">
                <div class="relative">
                    <div class="flex flex-row gap-3 overflow-x-auto pb-2 pr-16">
                        {#if activeTool}
                            {#each activeTool.options as option}
                                <Button
                                    href={`/community/${activeTool.name}/${option}`}
                                    pill
                                    class="capitalize "
                                    outline={!activeUrl.endsWith(option)}
                                >
                                    {option}
                                </Button>
                            {/each}
                        {/if}
                    </div>
                    <div
                        class="right-0 top-0 h-full bg-gradient-to-r from-transparent to-white absolute w-16 hover:opacity-0 transition-opacity"
                    />
                </div>
                <slot />
            </div>
        </div>
    {/if}
</div>
