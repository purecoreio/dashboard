<template>
    <v-card class="mb-3">
        <v-row no-gutters>
            <v-col>
                <v-text-field autofocus @keyup.enter="save()" hide-details v-model="name" label="Name" />
            </v-col>
            <v-col cols="3">
                <v-select @keyup.enter="save()" hide-details :items="types" v-model="type" label="Type" />
            </v-col>
            <v-col cols="3">
                <v-text-field @keyup.enter="save()" :min="isAbsolute ? null : 1" :max="isAbsolute ? null : 100"
                    hide-details v-model="amount" label="Amount"
                    :append-inner-icon="!isAbsolute ? 'mdi-percent' : 'mdi-delta'" type="number" />
            </v-col>
        </v-row>
        <div>
            <v-list>
                <v-list-subheader>Discount code</v-list-subheader>
                <v-list-item>
                    <v-row>
                        <v-col v-if="discount && !code" cols="12">
                            <v-alert>
                                You can tie this discount to a code in order to require manual action from the
                                customer
                            </v-alert>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field clearable :disabled="!canBeEdited" hide-details variant="outlined"
                                label="Code" v-model="code" />
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
        </div>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <div ref="error">
                <div v-if="error" class="px-4 mt-2">
                    <v-alert>
                        {{ error }}
                    </v-alert>
                </div>
            </div>
            <v-list-subheader>Applies to</v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col v-if="discount && packages.length <= 0 && categories.length <= 0" cols="12">
                        <v-alert>
                            This discount can be applied to the whole store, you can limit it by selecting specific
                            packages or categories
                        </v-alert>
                    </v-col>
                    <v-col cols="12">
                        <v-select clearable :disabled="!canBeEdited" variant="outlined" hide-details :items="[]"
                            v-model="categories" label="Categories" />
                    </v-col>
                    <v-col cols="12">
                        <v-select clearable :disabled="!canBeEdited" variant="outlined" hide-details :items="[]"
                            v-model="packages" label="Packages" />
                    </v-col>
                    <v-col v-if="discount && profiles.length <= 0" cols="12">
                        <v-alert>
                            This discount can be used by anyone. You can limit it to certain users by selecting
                            specific profiles
                        </v-alert>
                    </v-col>
                    <v-col cols="12">
                        <v-select clearable :disabled="!canBeEdited" variant="outlined" hide-details :items="[]"
                            v-model="profiles" label="Profiles" />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <v-list-subheader>Time range</v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col>
                        <datetime v-model="since" variant="outlined" label="Start date" />
                    </v-col>
                    <v-col>
                        <datetime v-model="until" variant="outlined" label="End date" />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <v-list-subheader>Usage count limits</v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="∞" clearable :min="1" :disabled="!canBeEdited"
                            label="Max uses per profile" variant="outlined" hide-details type="number" />
                    </v-col>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="∞" clearable :min="1" :disabled="!canBeEdited"
                            label="Max global uses" variant="outlined" hide-details type="number" />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <v-list-subheader>Item count limits and requirements</v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="1" clearable :min="2" :disabled="!canBeEdited"
                            label="Min checkout items" variant="outlined" hide-details type="number" />
                    </v-col>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="∞" clearable :min="2" :disabled="!canBeEdited"
                            label="Max checkout items" variant="outlined" hide-details type="number" />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <v-list-subheader>Past spending requirements </v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="0" clearable :min="1" :disabled="!canBeEdited"
                            label="Min previous purchases" variant="outlined" hide-details type="number" />
                    </v-col>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="∞" clearable :min="0" :disabled="!canBeEdited"
                            label="Max previous purchases" variant="outlined" hide-details type="number" />
                    </v-col>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="0" clearable :min="0.01"
                            :disabled="!canBeEdited" label="Min amount spent previously" variant="outlined" hide-details
                            type="number" />
                    </v-col>
                </v-row>
            </v-list-item>
            <v-list-subheader>Ownership requirements</v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col>
                        <v-select clearable :disabled="!canBeEdited" :model-value="'Packages'" :items="['Packages']"
                            hide-details variant="outlined" />
                    </v-col>
                    <v-col>
                        <v-select clearable :disabled="!canBeEdited" :model-value="'Own any'"
                            :items="['Own any', 'Own all', 'Don\'t own any']" variant="outlined" hide-details />
                    </v-col>
                    <v-col>
                        <v-select clearable :disabled="!canBeEdited" :items="[]" label="Packages" variant="outlined"
                            hide-details />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <v-list-subheader>Amount limits and requirements</v-list-subheader>
            <v-list-item>
                <v-row>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="0<" clearable :min="0.01"
                            :disabled="!canBeEdited" label="Min order amount" variant="outlined" hide-details
                            type="number" />
                    </v-col>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="∞" clearable :min="0.01"
                            :disabled="!canBeEdited" label="Max amount to discount per checkout" variant="outlined"
                            hide-details type="number" />
                    </v-col>
                    <v-col>
                        <v-text-field persistent-placeholder placeholder="∞" clearable :min="0.01"
                            :disabled="!canBeEdited" label="Max amount to discount globally" variant="outlined"
                            hide-details type="number" />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <v-card class="mb-3">
        <v-list>
            <v-list-subheader>Visibility and application settings</v-list-subheader>
            <v-list-item>
                <v-row no-gutters>
                    <v-col class="pl-2 mb-2" cols="12">
                        <v-row no-gutters>
                            <v-col cols="auto">
                                <v-checkbox density="compact" :disabled="!canBeEdited" hide-details />
                            </v-col>
                            <v-col class="ml-2 mt-2">
                                Suggest additional purchase units or profiles during checkout in order to
                                be elegible for this discount
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="pl-2 mb-2" cols="12">
                        <v-row no-gutters>
                            <v-col cols="auto">
                                <v-checkbox density="compact" :disabled="!canBeEdited" hide-details />
                            </v-col>
                            <v-col class="ml-2 mt-2">
                                Limit the discount to the elegible package pricing instead of the whole checkout
                                subtotal
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="pl-2 mb-2" cols="12">
                        <v-row no-gutters>
                            <v-col cols="auto">
                                <v-checkbox density="compact" :disabled="!canBeEdited" hide-details />
                            </v-col>
                            <v-col class="ml-2 mt-2">
                                Feature the discount publicly on the front page and directly on elegible package pricing
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="pl-2 mb-2" cols="12">
                        <v-row no-gutters>
                            <v-col cols="auto">
                                <v-checkbox density="compact" :disabled="!canBeEdited" hide-details />
                            </v-col>
                            <v-col class="ml-2 mt-2">
                                Limit the usage of this discount to gift purchases only. The customer will have to
                                verify a profile in order to ensure the target profile isn't owned by themselves
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="pl-2 mb-2" cols="12" v-if="this.code">
                        <v-row no-gutters>
                            <v-col cols="auto">
                                <v-checkbox density="compact" :disabled="!canBeEdited" hide-details />
                            </v-col>
                            <v-col class="ml-2 mt-2">
                                Automatically apply the discount if elegible
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
    <div class="px-5 py-2">
        <v-row align="center">
            <v-col v-if="discount" cols="auto">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn size="small" variant="text" icon v-bind="props">
                            <v-icon> mdi-dots-vertical </v-icon>
                        </v-btn>
                    </template>
                    <v-list class="py-0">
                        <v-list-item @click="remove()" class="text-red">
                            <v-list-item-icon icon="mdi-delete" />
                            <v-list-item-title class="pl-3">Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
            <v-col v-if="discount" cols="auto">
                <v-switch hide-details label="Enable" v-model="enabled" />
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn :disabled="loading" append-icon="mdi-content-save" v-if="!discount" @click="create()">
                    Create
                </v-btn>
                <v-btn :disabled="loading" append-icon="mdi-content-save" v-if="discount" @click="save()">
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import Datetime from '../../../../components/editor/Datetime.vue';
export default {
    props: ["network"],
    components: { Datetime },
    computed: {
        isAbsolute() {
            return this.type == "Absolute";
        },
        canBeEdited() {
            return !this.loading && this.discount;
        }
    },
    watch: {
        code(code) {
            if (code) this.code = code.toUpperCase()
        },
        async error(e) {
            if (e) {
                await this.$nextTick();
                this.$smoothScroll({ scrollTo: this.$refs.error });
            }
        },
    },
    data() {
        return {
            type: null,
            amount: null,
            name: null,
            enabled: null,
            types: ["Percent", "Absolute"],
            error: null,
            loading: false,
            store: null,
            discount: null,
            since: null,
            until: null,
            profiles: [],
            packages: [],
            categories: [],
            code: null
        };
    },
    async mounted() {
        this.store = await this.network.getStore();
        const id = this.$route.params.discount;
        if (id != "new") {
            this.loading = true;
            try {
                this.discount = await this.store.getDiscount(id);
                this.error = null;
            }
            catch (error) {
                this.error = error.message;
            }
            this.loading = false;
        }
        this.represent();
    },
    methods: {
        represent() {
            if (this.discount) {
                this.type = this.types[this.discount.type];
                this.amount = this.discount.isAbsolute ? this.discount.amount : this.discount.amount * 100;
                this.name = this.discount.name;
                this.enabled = this.discount.enabled;
                this.since = this.discount.since
                this.until = this.discount.until
                this.profiles = this.discount.profiles
                this.packages = this.discount.packages
                this.categories = this.discount.categories
                this.code = this.discount.code
            }
            else {
                this.type = this.types[0];
            }
        },
        async save() {
            if (this.discount) {
                await this.update()
            } else {
                await this.create()
            }
        },
        async create() {
            this.loading = true;
            try {
                const type = this.types.indexOf(this.type);
                this.discount = await this.store.createDiscount(this.name, type == 0 ? this.amount / 100 : this.amount, type);
                await this.$router.push({ path: `../discount/${this.discount.id}` });
                this.error = null;
            }
            catch (error) {
                this.error = error.message;
            }
            this.loading = false;
        },
        async update() {

        },
        async remove() {
            this.loading = true;
            try {
                await this.discount.delete();
                this.error = null;
                this.$router.push({ path: "../discount" });
            }
            catch (error) {
                this.error = error.message;
            }
            this.loading = false;
        }
    },
}
</script>