<script lang="ts">
	import SSO from "$lib/sso/SSO";
	import "../app.pcss";
	import Header from "./Header.svelte";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/button.svelte";
	import type Community from "$lib/sb/Community";
	import Aside from "./Aside.svelte";
	import { page } from "$app/stores";
	import * as ToggleGroup from "$lib/components/ui/toggle-group";

	import {
		Goal,
		Gavel,
		Cog,
		Users,
		Handshake,
		ShoppingBasket,
		Server,
	} from "lucide-svelte";
	import { fade } from "svelte/transition";
	import { onNavigate } from "$app/navigation";

	const categories: Record<string, any> = {
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
			options: ["key"],
		},
	};

	const sso = SSO.getInstance("serverbench.io");
	let logged = sso.logged;
	const methods = [
		"minecraft",
		"github",
		"google",
		"microsoft",
		"steam",
		"xbox",
		"discord",
	];
	let community: Community | null;

	async function login(method: string) {
		await sso.login(method);
		logged = sso.logged;
	}

	let height: number;
	let width: number;
	let hide: boolean = false;

	let timeout: number;
	onNavigate(() => {
		clearTimeout(timeout);
		hide = true;
		return new Promise((resolve) => {
			timeout = setTimeout(() => {
				resolve();
				hide = false;
			}, 75);
		});
	});

	$: currentCategory =
		Object.keys(categories).find(
			(m) => m == $page.url.pathname.split("/")[1],
		) ?? null;

	$: optionUrl = $page.url.pathname.split("/").slice(0, 3).join("/");
</script>

{#if logged}
	<Header bind:height bind:community {categories} {currentCategory} />
	<Aside bind:width {height} {categories} {currentCategory} />
	{#if community}
		{#key community}
			<div class="grow py-4 w-full h-screen overflow-y-scroll">
				<div style={`min-height:${height}px;`} />
				<div class="flex flex-row justify-between">
					<div
						class="hidden lg:block"
						style={`min-width:${width ?? 0}px`}
					/>
					<main class="px-2 grow">
						{#if !hide}
							<div
								class="max-w-4xl mx-auto w-full flex flex-col gap-3"
								transition:fade={{ duration: 75, delay: 0 }}
							>
								{#if currentCategory}
									<div
										class="flex flex-row gap-3 items-center"
									>
										{#each categories[currentCategory].options as option}
											<Button
												href={`/${currentCategory}/${option}`}
												variant={optionUrl ==
												`/${currentCategory}/${option}`
													? "default"
													: "outline"}
												class="capitalize rounded-full"
											>
												{option}
											</Button>
										{/each}
									</div>
								{/if}
								<slot />
							</div>
						{/if}
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
	<div class="h-screen flex flex-col items-center justify-center">
		<main class="w-full text-center flex flex-col gap-3 max-w-sm">
			<h1 class="font-bold text-2xl">serverbench</h1>
			<Card.Root class="flex flex-col gap-1 p-2">
				{#each methods as method}
					<Button on:click={() => login(method)} class="capitalize">
						{method}
					</Button>
				{/each}
			</Card.Root>
			<small>
				serverbench.io is a product built by <a
					target="_blank"
					class="underline"
					href="https://nominal.es">nominal.es</a
				>.<br />
				By logging in you accept our
				<a
					class="underline"
					target="_blank"
					href="https://nominal.es/legal">terms of service</a
				>
				and
				<a
					class="underline"
					target="_blank"
					href="https://nominal.es/legal">privacy policy</a
				>
			</small>
		</main>
	</div>
{/if}
