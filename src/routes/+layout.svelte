<script lang="ts">
	import SSO from "$lib/sso/SSO";
	import "../app.pcss";
	import Header from "./Header.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import type Community from "$lib/sb/Community";
	import Aside from "./Aside.svelte";
	import { page } from "$app/stores";

	import {
		Goal,
		Gavel,
		Cog,
		Users,
		Handshake,
		ShoppingBasket,
		Server,
		Video,
	} from "lucide-svelte";
	import { fade } from "svelte/transition";
	import { onNavigate } from "$app/navigation";
	import Chat from "$lib/components/serverbench/chat.svelte";
	import Login from "./Login.svelte";

	const allCategories: Record<string, any> = {
		"": {
			moderation: {
				icon: Gavel,
				options: ["activity", "punishments", "appeals"],
			},
			community: {
				icon: Users,
				options: ["players", "demographics"],
			},
			marketing: {
				icon: Goal,
				options: ["voting", "media"],
			},
			monetization: {
				icon: ShoppingBasket,
				options: [
					"transactions",
					"packages",
					"variables",
					"sales",
					"coupons",
					"subscriptions",
				],
			},
			servers: {
				icon: Server,
				options: ["hosts"],
			},
			team: {
				icon: Handshake,
				options: ["members", "roles", "invites"],
			},
			settings: {
				icon: Cog,
				options: ["key", "discord"],
			},
		},
		"/you": {
			media: {
				icon: Video,
				options: ["submissions"],
			},
		},
	};

	const sso = SSO.getInstance("serverbench.io");
	let logged = sso.logged;

	function handleLogin(event: CustomEvent<boolean>) {
		logged = event.detail;
	}

	let community: Community | null;

	let height: number;
	let width: number;
	let hide: boolean = false;

	const animationDuration = 100;

	let timeout: NodeJS.Timeout;
	onNavigate(() => {
		clearTimeout(timeout);
		hide = true;
		return new Promise((resolve) => {
			timeout = setTimeout(() => {
				resolve();
				hide = false;
			}, animationDuration);
		});
	});

	$: currentCategory =
		Object.keys(categories).find(
			(m) => m == $page.url.pathname.substring(base.length).split("/")[1],
		) ?? null;

	$: optionUrl = $page.url.pathname;

	$: base = $page.url.pathname.startsWith("/you/") ? "/you" : "";
	$: categories = allCategories[base];
</script>

{#if logged}
	<Header bind:height bind:community {base} {categories} {currentCategory} />
	<Aside bind:width {height} {base} {categories} {currentCategory} />
	{#if community || base != ""}
		{#key community}
			<div class="fixed right-6 bottom-3 max-w-md z-50">
				{#if base == "" && optionUrl != "/moderation/activity"}
					<Chat popup={true} />
				{/if}
			</div>
			<div class="grow py-4 w-full h-screen overflow-y-scroll">
				<div style={`min-height:${height}px;`} />
				<div class="flex flex-row justify-between">
					<div
						class="hidden lg:block"
						style={`min-width:${width ?? 0}px`}
					/>
					<main class="px-2 grow">
						<div
							class="max-w-4xl mx-auto w-full flex flex-col gap-3"
						>
							{#if currentCategory}
								<div class="flex flex-row gap-3 items-center">
									{#each categories[currentCategory].options as option}
										<Button
											href={`${base}/${currentCategory}/${option}`}
											variant={`${base}/${currentCategory}/${option}`.startsWith(
												optionUrl,
											)
												? "default"
												: "outline"}
											class="capitalize rounded-full"
										>
											{option}
										</Button>
									{/each}
								</div>
								{#if !hide}
									<div
										class="flex flex-col gap-3"
										transition:fade={{
											duration: animationDuration,
											delay: 0,
										}}
									>
										<slot />
									</div>
								{/if}
							{/if}
						</div>
					</main>
					<div
						class="hidden lg:block"
						style={`min-width:${width ?? 0}px`}
					/>
				</div>
			</div>
		{/key}
	{/if}
{:else}
	<Login on:logged={handleLogin} />
{/if}
