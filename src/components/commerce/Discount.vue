<template>
    <v-card :to="`discount/${discount.id}`">
        <v-list-item>
            <v-row align="center">
                <v-col cols="auto">
                    <v-list-item-title>
                        {{ discount.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        #{{ discount.id }}
                    </v-list-item-subtitle>
                </v-col>
                <v-col v-if="discount.since || discount.until" cols="auto">
                    <v-list-item-subtitle>
                        <span v-if="!discount.enabled">If enabled, </span>
                        <span v-if="discount.since">will start on {{discount.since}}</span>
                        <span v-if="discount.since && discount.until"> and </span>
                        <span v-if="discount.until">will end on {{discount.until}}</span>
                    </v-list-item-subtitle>
                </v-col>
                <v-spacer/>
                <v-col cols="auto">
                    <v-chip prepend-icon="mdi-minus" :append-icon="!discount.isAbsolute ? 'mdi-percent' : 'mdi-delta'">
                        {{ discount.isAbsolute ? discount.amount : discount.amount * 100 }}</v-chip>
                </v-col>
                <v-col cols="auto">
                    <v-switch color="primary" hide-details />
                </v-col>
            </v-row>
        </v-list-item>
    </v-card>
</template>
<script>
export default {
    props: ["discount"]
}
</script>