<template>
    <v-snackbar variant="text" text color="primary" v-model="message">
        <p class="text-center ma-0">
            {{ error }}
        </p>
    </v-snackbar>
    <v-card class="pa-4">
        <center>
            <v-img :width="name == 'stripe' ? 95 : 87" contain :height="52" :src="icon" />
            <v-checkbox :disabled="loading" hide-details label="Credit fallback" />
        </center>
        <v-divider class="mb-4" />
        <v-btn :loading="loading" @click="link" block>
            Link
        </v-btn>
    </v-card>
</template>
<script>
import paypal from "@/assets/commerce/gateway/paypal.svg";
import mollie from "@/assets/commerce/gateway/mollie.svg";
import stripe from "@/assets/commerce/gateway/stripe.svg";
export default {
    props: ["name", "store"],
    emits: ["linked"],
    data: () => {
        return {
            message: null,
            loading: false,
        }
    },
    computed: {
        icon() {
            switch (this.name.toLowerCase()) {
                case "mollie":
                    return mollie;
                case "paypal":
                    return paypal;
                case "stripe":
                    return stripe;
            }
        },
    },
    methods: {
        showMessage(message) {
            this.message = message
            setTimeout(() => {
                this.message = null
            }, 10000);
        },
        async link(privateKey = null, publicKey = null) {
            this.loading = true
            try {
                await this.store.linkGateway(this.name, privateKey, publicKey)
                this.$emit("linked")
                this.showMessage(`successfully linked ${this.name}, it may take some minutes for it to appear on your gateway list`)
            } catch (error) {
                // this.showMessage(error.message)
            }
            this.loading = false
        }
    }
}
</script>