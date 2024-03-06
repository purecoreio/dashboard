<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import Community from "$lib/sb/Community";
	import Srvbench from "$lib/sb/Srvbench";
	import type Staff from "$lib/sb/Staff";
	import Profile from "$lib/sso/Profile";
	import SSO from "$lib/sso/SSO";
	import {
		Loader2,
		ShieldHalf,
		ShieldCheck,
		PlusCircle,
		ArrowRightLeft,
	} from "lucide-svelte";
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { fade } from "svelte/transition";
	import CreateJoin from "./CreateJoin.svelte";
	import MiniNav from "./MiniNav.svelte";
	import { toggleMode, ModeWatcher } from "mode-watcher";

	let nav: HTMLElement;

	const sso = SSO.getInstance("serverbench.io");
	const srvbench = Srvbench.getInstance();
	$: primary = profiles.find((p) => sso.session!.profile.id == p.id);
	$: hasCommunity =
		ownedCommunities.length > 0 || moderatedCommunities.length > 0;
	let profiles: Profile[] = [];

	let ownedCommunities: Community[] = [];
	let moderatedCommunities: Staff[] = [];
	let loadingCommunities: boolean = true;
	export let community: Community | null = null,
		categories: Record<string, any>,
		base: string,
		currentCategory: string | null;
	let creating: boolean = false;

	function getFirstChar(profile: Profile) {
		return (
			profile.readableName?.charAt(0) ??
			profile.eid?.charAt(0) ??
			profile.id.charAt(0)
		).toUpperCase();
	}

	async function loadCommunities(force: boolean = false) {
		loadingCommunities = true;
		ownedCommunities = await srvbench.getOwnedCommunities(force);
		moderatedCommunities = await srvbench.getModeratedCommunities(force);
		try {
			await srvbench.restoreCommunity();
		} catch (error) {
			// ignore
		}
		community = srvbench.getCommunity();
		const communities = [
			...ownedCommunities,
			...moderatedCommunities.map((c) => c.community),
		];
		if (community == null && communities.length > 0) {
			srvbench.setCommunity(communities[0]);
			community = communities[0];
		}
		loadingCommunities = false;
		if (!hasCommunity) creating = true;
	}

	function updateCommunity(newCommunity: Community) {
		srvbench.setCommunity(newCommunity);
		community = newCommunity;
	}

	onMount(async () => {
		profiles = await sso.session!.user.getProfiles();
		await loadCommunities();
	});

	async function handleCreate(e: CustomEvent<Community>) {
		srvbench.setCommunity(e.detail);
		creating = false;
		await loadCommunities(true);
	}

	export let height = 57;

	$: nav?.offsetHeight,
		(() => {
			height = nav?.offsetHeight;
		})();
</script>

<ModeWatcher defaultMode={"light"} track={true} />

{#if base == ""}
	<CreateJoin
		on:community={handleCreate}
		force={!hasCommunity && !loadingCommunities}
		bind:creating
	/>
{/if}

<nav
	bind:this={nav}
	class="bg-white dark:bg-black dark:border-neutral-900 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-lg py-2 flex flex-row items-center fixed w-full px-4 border-b-[1px] gap-3 z-50"
>
	<div class="block lg:hidden">
		<MiniNav {base} {categories} {currentCategory} />
	</div>
	<a href="/" class="flex flex-row items-center gap-2 grow">
		<span class="font-semibold text-xl"> serverbench </span>
		<!-- <Badge class="hidden lg:block">alpha</Badge> -->
	</a>
	{#if community && base==''}
		<div in:fade={{ duration: 100 }}>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button
						class="rounded-full  flex flex-row items-center gap-2"
						variant="secondary"
					>
						<ArrowRightLeft class="h-4 w-4" />
						<span class="hidden sm:block">
							{community.name}
						</span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						{#each ownedCommunities as ownedCommunity}
							<DropdownMenu.Item
								class={ownedCommunity.id == community.id
									? "font-bold"
									: ""}
								on:click={() => updateCommunity(ownedCommunity)}
							>
								<ShieldCheck class="mr-1 h-4 w-4" />
								{ownedCommunity.name}</DropdownMenu.Item
							>
						{/each}
						{#each moderatedCommunities as moderatedCommunity}
							<DropdownMenu.Item
								class={moderatedCommunity.community.id ==
								community.id
									? "font-bold"
									: ""}
								on:click={() =>
									updateCommunity(
										moderatedCommunity.community,
									)}
							>
								<ShieldHalf class="mr-1 h-4 w-4" />
								{moderatedCommunity.community
									.name}</DropdownMenu.Item
							>
						{/each}
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={() => (creating = true)}>
							<PlusCircle class="mr-1 h-4 w-4" />
							Create / Join</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{/if}
	<!--<ModeWatcher />-->
	<div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					{#if !primary}
						<Avatar.Fallback>
							<Loader2 class="animate-spin w-4 h-4" />
						</Avatar.Fallback>
					{:else}
						<!--<Avatar.Image
							src={primary.pfp}
							alt={primary.readableName}
						/>-->
						<Avatar.Fallback>
							{getFirstChar(primary)}
						</Avatar.Fallback>
					{/if}
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					{#each profiles as profile}
						<DropdownMenu.Item
							class="flex flex-row items-center gap-2"
						>
							<Avatar.Root class="w-5 h-5">
								<Avatar.Image
									src={profile.pfp}
									alt={profile.readableName}
								/>
								<Avatar.Fallback>
									{getFirstChar(profile)}
								</Avatar.Fallback>
							</Avatar.Root>
							{profile.readableName}
						</DropdownMenu.Item>
					{/each}
					<DropdownMenu.Separator />
					<DropdownMenu.Item href="/you/media/submissions">Media</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={toggleMode}
						>Dark/Light Mode</DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</nav>
