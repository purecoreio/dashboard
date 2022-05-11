<template>
    <v-alert class="mb-5" v-if="error">
        {{ error }}
    </v-alert>
    <discount :store="store" v-if="creating" />
    <discount v-for="discount in discounts" :key="discount.id" :store="store" :discount="discount" />
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
            creating: false
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