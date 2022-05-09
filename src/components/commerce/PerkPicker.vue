<template>
    <v-card>
        <v-toolbar style="border-bottom-left-radius:0px;border-bottom-right-radius:0px;" :rounded="true">Perks
        </v-toolbar>
        <div>
            <v-list v-for="perkCategory in this.package.perks" :key="perkCategory.category.id">
                <v-list-subheader>{{ perkCategory.category.name }}</v-list-subheader>
                <v-list-item v-for="perk in perkCategory.perks" :key="perk.perk.id">
                    <v-row align="center">
                        <v-col cols="auto">
                            <v-avatar color="primary">
                                {{ perk.quantity }}
                            </v-avatar>
                        </v-col>
                        <v-col>
                            <v-list-item-title>
                                {{ perk.perk.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                #{{ perk.perk.id }}
                            </v-list-item-subtitle>
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
        </div>
        <v-divider v-if="this.package.perks.length > 0" />
        <div class="pa-5">
            <v-alert class="mb-5" v-if="error">
                {{ error }}
            </v-alert>
            <v-row align="center">
                <v-col>
                    <v-row>
                        <v-col cols="12" md="auto" v-if="quantity != null">
                            <v-text-field @keyup.enter="addPerk()" @click:clear="quantity = null" clearable
                                v-model="quantity" label="Quantity" hide-details :disabled="loading" type="number"
                                variant="outlined" />
                        </v-col>
                        <v-col>
                            <v-combobox @keyup.enter="addPerk()" hide-details :disabled="loading" :loading="loading"
                                v-model="perk"
                                :items="perks.filter(p => !usedPerks.map(u => u.perk.id).includes(p.id)).map(p => p.name)"
                                label="Perk" variant="outlined" />
                        </v-col>
                        <v-col v-if="isNewPerk" cols="12">
                            <v-combobox @keyup.enter="addPerk()" hide-details :disabled="loading" :loading="loading"
                                v-model="category" :items="categories.map(c => c.name)" label="Category"
                                variant="outlined" />
                        </v-col>
                        <v-col v-if="isNewPerk" class="text-right" cols="12">
                            <v-btn @click="addPerk()" append-icon="mdi-content-save">
                                Create
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col v-if="!isNewPerk" cols="auto">
                    <v-btn @click="addPerk()" icon>
                        <v-icon icon="mdi-plus" />
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script>
export default {
    props: ["package"],
    watch: {
        perk(perk) {
            if (perk != null) {
                if (perk.length == 2 && perk[0] == " ") {
                    this.perk = perk.trim()
                } else if (perk.length == 0) {
                    this.quantity = null
                }
                const perkParts = this.perk.split(" ")
                if (this.quantity == null && perkParts.length > 1) {
                    const newString = []
                    const candidates = []
                    for (const part of perkParts) {
                        const sanitized = part.replaceAll(",", ".").replaceAll("x", "").replaceAll("X", "")
                        if (sanitized.length > 0) {
                            if (!isNaN(sanitized)) {
                                candidates.push(Number(sanitized))
                            } else {
                                newString.push(part)
                            }
                        }
                    }
                    if (candidates.length > 0) {
                        this.quantity = candidates[0]
                        this.perk = newString.length > 0 ? newString.join(" ") : " "
                    }
                }
            }
        }
    },
    computed: {
        isNewPerk() {
            return this.perk && this.perks.filter(perk => perk.name == this.perk).length <= 0
        },
        usedPerks() {
            const perks = []
            if (this.package) {
                for (const perkTree of this.package.perks) {
                    perks.push(...perkTree.perks)
                }
            }
            return perks
        }
    },
    async mounted() {
        this.store = await this.package.network.getStore()
        await this.loadGlobalPerks()
    },
    methods: {
        async loadGlobalPerks() {
            this.loading = true
            try {
                this.perks = []
                this.categories = await this.store.getPerks()
                for (const category of this.categories) {
                    this.perks.push(...category.perks)
                }
                this.error = null
            } catch (error) {
                this.error = error.message
            }
            this.loading = false
        },
        async addPerk() {
            this.loading = true
            try {
                let perk = this.perks.filter((p) => p.name == this.perk)[0]
                let category = perk ? perk.category : (this.categories.filter((c) => c.name == this.category)[0])
                if (!perk) {
                    if (!category) {
                        category = await this.store.createPerkCategory(this.category)
                    }
                    await category.createPerk(this.package, this.perk, this.quantity)
                } else {
                    await this.package.addPerk(perk, this.quantity)
                }
                this.quantity = null
                this.perk = ""
                this.error = null
            } catch (error) {
                this.error = error.message
            }
            this.loading = false
        }
    },
    data() {
        return {
            perk: null,
            quantity: null,
            loading: false,
            perks: [],
            category: null,
            categories: [],
            store: null,
            error: null
        }
    }
}
</script>