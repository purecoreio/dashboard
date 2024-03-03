<script lang="ts">
    import MediaIcon from "$lib/components/serverbench/mediaIcon.svelte";
    import Section from "$lib/components/serverbench/section.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Button from "$lib/components/ui/button/button.svelte";
    import { MoreVertical } from "lucide-svelte";
    import type { MediaPlatform } from "$lib/sb/media/MediaProfile";
    import Todo from "$lib/components/serverbench/todo.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Badge } from "$lib/components/ui/badge";
    import { onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type MediaProfile from "$lib/sb/media/MediaProfile";
    import type Creator from "$lib/sb/media/Creator";
    import JoinAsCreator from "./JoinAsCreator.svelte";
    import SubmitContent from "./SubmitContent.svelte";
    import type Submission from "$lib/sb/media/Submission";
    import Onboarding from "./Onboarding.svelte";
    import { page } from "$app/stores";

    const platforms: MediaPlatform[] = ["youtube", "tiktok", "twitch"];

    const user = Srvbench.getInstance().getUser();

    let sources: MediaProfile[] = [];
    let creatorProfiles: Creator[] = [];
    let submissions: Submission[] = [];
    let submitting: boolean = false;

    onMount(async () => {
        await load();
    });

    function startSubmit() {
        if ($page.url.searchParams.has("media_submit")) submitting = true;
    }

    async function load() {
        sources = await user.listMediaSources();
        creatorProfiles = await user.listMediaProfiles();
        submissions = await user.getSubmissions();
    }

    async function link(platform: MediaPlatform) {
        await user.linkMediaSource(platform);
        await load();
    }
</script>

<Onboarding on:created={load} on:finished={startSubmit} {platforms} />
<Section title="Accounts">
    <Card.Root class="overflow-hidden">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Account</Table.Head>
                    <Table.Head class="text-right">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button size="sm" variant="outline"
                                    >Link Account</Button
                                >
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Group>
                                    <DropdownMenu.Label
                                        >My Account</DropdownMenu.Label
                                    >
                                    <DropdownMenu.Separator />
                                    {#each platforms as platform}
                                        <DropdownMenu.Item
                                            on:click={() => link(platform)}
                                            class="flex flex-row gap-2 items-center"
                                        >
                                            <MediaIcon {platform} />
                                            {platform}
                                        </DropdownMenu.Item>
                                    {/each}
                                </DropdownMenu.Group>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each sources as source}
                    <Table.Row>
                        <Table.Cell>
                            <div class="flex flex-row gap-2 items-center">
                                <MediaIcon platform={source.platform} />
                                {source.username}
                            </div>
                        </Table.Cell>
                        <Table.Cell class="text-right">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button
                                        class="rounded-full"
                                        size="icon"
                                        variant="outline"
                                    >
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Label
                                            >Manage</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Separator />
                                        <DropdownMenu.Item
                                            >Refresh</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Unlink</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
<Section title="Communities">
    <Card.Root class="overflow-hidden">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Community</Table.Head>
                    <Table.Head>Creator Code</Table.Head>
                    <Table.Head class="text-right">
                        <JoinAsCreator on:created={() => load()} />
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each creatorProfiles as profile}
                    <Table.Row>
                        <Table.Cell>{profile.community.name}</Table.Cell>
                        <Table.Cell>
                            <Input disabled value={profile.code} />
                        </Table.Cell>
                        <Table.Cell class="text-right">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button
                                        class="rounded-full"
                                        size="icon"
                                        variant="outline"
                                    >
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Label
                                            >Manage</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Separator />
                                        <DropdownMenu.Item
                                            >Abandon</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
<Section title="submissions">
    <Card.Root class="overflow-hidden">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Account</Table.Head>
                    <Table.Head>Community</Table.Head>
                    <Table.Head>Video</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head class="text-right">
                        <SubmitContent
                            bind:submitting
                            on:submitted={() => load()}
                            {creatorProfiles}
                        />
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each submissions as submission}
                    <Table.Row>
                        <Table.Cell class="text-nowrap">
                            <div class="flex flex-row gap-2 items-center">
                                <MediaIcon
                                    platform={submission.profile.platform}
                                />
                                {submission.profile.username}
                            </div>
                        </Table.Cell>
                        <Table.Cell
                            >{submission.uploader.community.name}</Table.Cell
                        >
                        <Table.Cell>
                            <Input disabled value={submission.title} />
                        </Table.Cell>
                        <Table.Cell>
                            {#if submission.verification.declined == null}
                                <Badge>Reviewing</Badge>
                            {:else if submission.verification.declined}
                                <Badge variant="destructive">Declined</Badge>
                            {:else}
                                <Badge variant="secondary">Approved</Badge>
                            {/if}
                        </Table.Cell>
                        <Table.Cell class="text-right">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button
                                        class="rounded-full"
                                        size="icon"
                                        variant="outline"
                                    >
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Group>
                                        <DropdownMenu.Label
                                            >Manage</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Separator />
                                        <DropdownMenu.Item
                                            >Unlist</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
<Section title="analytics">
    <Todo />
</Section>
