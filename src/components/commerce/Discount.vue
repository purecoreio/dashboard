<template>
    <v-card>
        <v-row no-gutters>
            <v-col>
                <v-select hide-details :items="types" v-model="type" label="Type" />
            </v-col>
            <v-col>
                <v-text-field :min="isAbsolute ? null : 1" :max="isAbsolute ? null : 100" hide-details v-model="amount"
                    label="Amount" :append-inner-icon="!isAbsolute ? 'mdi-percent' : 'mdi-delta'" type="number" />
            </v-col>
        </v-row>
        <div class="mb-5">
            <v-list class="pb-4">
                <v-list-subheader>Applies to</v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col cols="12">
                            <v-select :disabled="!canBeEdited" variant="outlined" hide-details :items="[]"
                                v-model="type" label="Categories" />
                        </v-col>
                        <v-col cols="12">
                            <v-select :disabled="!canBeEdited" variant="outlined" hide-details :items="[]"
                                v-model="type" label="Packages" />
                        </v-col>
                        <v-col cols="12">
                            <v-select :disabled="!canBeEdited" variant="outlined" hide-details :items="[]"
                                v-model="type" label="Profiles" />
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
            <v-divider />
            <v-list>
                <v-list-subheader>Usage count limits</v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Max uses per profile" variant="outlined"
                                hide-details type="number" />
                        </v-col>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Max global uses" variant="outlined"
                                hide-details type="number" />
                        </v-col>
                    </v-row>
                </v-list-item>
                <v-list-subheader>Item count limits and requirements</v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Min checkout item count" variant="outlined"
                                hide-details type="number" />
                        </v-col>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Max checkout item count" variant="outlined"
                                hide-details type="number" />
                        </v-col>
                    </v-row>
                </v-list-item>
                <v-list-subheader>Past spending requirements </v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Min amount of previously acquired items"
                                variant="outlined" hide-details type="number" />
                        </v-col>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Min amount spent previously"
                                variant="outlined" hide-details type="number" />
                        </v-col>
                    </v-row>
                </v-list-item>
                <v-list-subheader>Amount limits and requirements</v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Min order quantity" variant="outlined"
                                hide-details type="number" />
                        </v-col>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Max amount to discount per checkout"
                                variant="outlined" hide-details type="number" />
                        </v-col>
                        <v-col>
                            <v-text-field :disabled="!canBeEdited" label="Max amount to discount globally"
                                variant="outlined" hide-details type="number" />
                        </v-col>
                    </v-row>
                </v-list-item>
                <v-list-subheader>Ownership requirements</v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col>
                            <v-select :disabled="!canBeEdited" :model-value="'Packages'" :items="['Packages']"
                                hide-details variant="outlined" />
                        </v-col>
                        <v-col>
                            <v-select :disabled="!canBeEdited" :model-value="'Own any'"
                                :items="['Own any', 'Own all', 'Don\'t own any']" variant="outlined" hide-details />
                        </v-col>
                        <v-col>
                            <v-select :disabled="!canBeEdited" :items="[]" label="Packages" variant="outlined"
                                hide-details />
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
        </div>
        <div class="text-right px-5 pb-5">
            <v-btn :disabled="loading" append-icon="mdi-content-save" v-if="!discount" @click="create()">
                Create
            </v-btn>
            <v-btn :disabled="loading" append-icon="mdi-content-save" v-if="discount" @click="save()">
                Save
            </v-btn>
        </div>
    </v-card>
</template>
<script>
export default {
    props: ["store", "discount"],
    computed: {
        isAbsolute() {
            return this.type == 'Absolute'
        },
        canBeEdited() {
            return !this.loading && this.discount
        }
    },
    data() {
        return {
            type: null,
            amount: null,
            types: ["Percent", "Absolute"],
            error: null,
            loading: false
        }
    },
    mounted() {
        if (this.discount) {
            this.amount = discount.amount
            this.type = this.types[discount.type]
        } else {
            this.type = this.types[0]
        }
    },
    methods: {
        async create() {
            this.loading = true
            try {
                const type = this.types.indexOf(this.type)
                this.discount = await this.store.createDiscount(type == 0 ? this.amount / 100 : this.amount, type)
                this.error = null
            } catch (error) {
                this.error = error.message
            }
            this.loading = false
        }
    }
}
</script>