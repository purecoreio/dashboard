<script lang="ts">
	import SSO from "$lib/sso/SSO";
	import "../app.pcss";
	import Header from "./Header.svelte";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/button.svelte";
	import type Community from "$lib/sb/Community";
	import Aside from "./Aside.svelte";
	import {
		Goal,
		Gavel,
		Cog,
		Users,
		Handshake,
		ShoppingBasket,
		Server,
	} from "lucide-svelte";

	const categories: Record<string, any> = {
		moderation: Gavel,
		community: Users,
		marketing: Goal,
		monetization: ShoppingBasket,
		servers: Server,
		team: Handshake,
		settings: Cog,
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
</script>

{#if logged}
	<Header bind:height bind:community {categories} />
	<Aside bind:width {height} {categories} />
	{#if community}
		{#key community}
			<div class="grow pt-4 w-full h-screen overflow-y-scroll">
				<div style={`min-height:${height}px;`} />
				<div class="flex flex-row justify-between">
					<div
						class="hidden xl:block"
						style={`min-width:${width ?? 0}px`}
					/>
					<main class="px-2 grow">
						<div class="max-w-4xl mx-auto w-full flex flex-col gap-3">
							<slot />
						</div>
					</main>
					<div
						class="hidden xl:block"
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
