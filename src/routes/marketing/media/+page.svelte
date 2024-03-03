<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Submission, { mock } from "$lib/sb/media/Submission";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { MoreVertical } from "lucide-svelte";
    import MediaIcon from "$lib/components/serverbench/mediaIcon.svelte"
    import Submissions from "./Submissions.svelte";
    let pending: Submission[] = [mock];
    let creators = [mock.creator];
    let submissions = pending;
</script>

<Section title="Pending Reviews">
    <Submissions submissions={pending} />
</Section>

<Section title="Creators">
    <Card.Root>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head class="w-[100px]">Creator</Table.Head>
                    <Table.Head>Delivered Players</Table.Head>
                    <Table.Head>Code</Table.Head>
                    <Table.Head class="text-right">Options</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each creators as creator}
                    <Table.Row>
                        <Table.Cell>
                            {creator.member.name}
                        </Table.Cell>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>
                            <Input disabled value={creator.code} />
                        </Table.Cell>
                        <Table.Cell class="text-right">
                            <Button
                                size="icon"
                                class="rounded-full"
                                variant="outline"
                            >
                                <MoreVertical />
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>

<Section title="Submissions">
    <Submissions submissions={pending} />
</Section>
