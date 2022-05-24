<template>
    <v-toolbar v-if="discounts.length > 0" class="mb-2">
        <v-spacer />
        <v-btn class="my-5" :disabled="creating" :color="creating ? null : 'primary'" to="discount/new" icon
            variant="text">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-toolbar>
    <v-alert class="mb-2" v-if="error">
        {{ error }}
    </v-alert>
    <div v-if="!loading">
        <div class="text-center" style="padding-top:26px" v-if="discounts.length <= 0">
            <h1 class="mb-5">Engage your customers with discounts!</h1>
            <v-btn to="discount/new" append-icon="mdi-plus">Create discount</v-btn>
        </div>
        <discount v-for="discount in discounts" :key="discount.id" :discount="discount" class="mb-2" />
    </div>
</template>
<script>
import Discount from '../../../../components/commerce/Discount.vue'
export default {
    components: { Discount },
    props: ["network"],
    async mounted() {
        this.store = await this.network.getStore()
        await this.loadDiscounts()
    },
    data() {
        return {
            discounts: [],
            loading: false,
            error: null,
            store: null,
        }
    },
    methods: {
        async loadDiscounts() {
            this.loading = true
            try {
                this.discounts = await this.store.getDiscounts()
                if (this.discounts.length <= 0) this.creating = true
                this.error = null
            } catch (error) {
                this.error = error.message
            }
            this.loading = false
        }
    }
}
</script>