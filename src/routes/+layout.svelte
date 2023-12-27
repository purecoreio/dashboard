<script lang="ts">
    import type Profile from "$lib/sso/Profile";
    import SSO from "$lib/sso/SSO";
    import { onMount } from "svelte";
    import "../app.pcss";

    import {
        Navbar,
        NavBrand,
        NavUl,
        NavHamburger,
        ListPlaceholder,
        Spinner,
    } from "flowbite-svelte";

    import { Button, Dropdown, DropdownItem, Avatar } from "flowbite-svelte";
    import { ChevronDownSolid } from "flowbite-svelte-icons";
    import { goto } from "$app/navigation";

    let sso = SSO.getInstance("serverbench.io");
    let profiles: Profile[] | null = null;
    $: mainProfile = profiles?.find((p) => sso.session?.profile.id == p.id);
    onMount(async () => {
        if (sso.logged) {
            profiles = await sso.session!.user.getProfiles();
            sso = sso;
        } else {
            goto('/login')
        }
    });
</script>

{#if sso.logged}
    <Navbar
        class="px-2 sm:px-4 py-2.5 w-full z-20 border-b max-w-full"
    >
        <NavBrand href="/">
            <span
                class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
                >serverbench</span
            >
        </NavBrand>
        <NavHamburger />
        <NavUl ulClass="p-0">
            <Button>
                {#if profiles == null}
                    <Spinner size="5" />
                {:else}
                    {mainProfile?.readableName}
                    <ChevronDownSolid
                        class="w-3 h-3 ms-2 text-white dark:text-white"
                    />
                {/if}
            </Button>
            <Dropdown class="w-48 overflow-y-auto py-0 max-h-48">
                {#if profiles == null}
                    <ListPlaceholder />
                {:else}
                    {#each profiles as profile}
                        <DropdownItem
                            class="flex items-center text-base font-semibold gap-2"
                        >
                            <Avatar
                                src={profile.pfp ?? ''}
                                size="xs"
                            />{profile.readableName}
                        </DropdownItem>
                    {/each}
                {/if}
            </Dropdown>
        </NavUl>
    </Navbar>
{/if}

<div>
    <slot />
</div>
