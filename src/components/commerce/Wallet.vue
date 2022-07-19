<template>
    <v-card class="px-5 py-3 mb-3">
        <v-row align="center">
            <v-col style="width:120px" cols="auto">
                <center>
                    <v-img :width="wallet.service == 'stripe' ? 120 : 87" contain position="left" :height="52" :src="icon" />
                </center>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn :disabled="!wallet.available" :color="wallet.available ? 'primary' : null" size="small" variant="text" icon>
                    <v-icon> mdi-cog-outline </v-icon>
                </v-btn>
            </v-col>
            <v-col v-if="linked" cols="auto">
                <v-btn-toggle mandatory :disabled="!enabled" :color="enabled ? 'primary' : null" style="height: 42px"
                    v-model="credit">
                    <v-btn prepend-icon="mdi-circle-multiple-outline" :value="1"> Credit </v-btn>
                    <v-btn prepend-icon="mdi-forwardburger" :value="0"> Forward </v-btn>
                </v-btn-toggle>
            </v-col>
            <v-col v-if="wallet.available" cols="auto">
                <v-icon>mdi-check</v-icon> accepting payments
            </v-col>
            <v-col v-if="!wallet.available" cols="auto">
                <v-btn color="warning" href="https://dashboard.stripe.com/settings/update" target="_blank" variant="text" append-icon="mdi-alert">
                    Fix
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import paypal from "@/assets/commerce/gateway/paypal.svg";
import mollie from "@/assets/commerce/gateway/mollie.svg";
import stripe from "@/assets/commerce/gateway/stripe.svg";
export default {
    props: ["wallet"],
    computed: {
        icon() {
            switch (this.wallet.service.toLowerCase()) {
                case "stripe":
                    return stripe;
                case "paypal":
                    return paypal;
                case "mollie":
                    return mollie;
            }
        },
    },
};
</script>
