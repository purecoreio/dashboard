<template>
  <v-snackbar variant="text" text color="primary" v-model="message">
    {{ message }}
  </v-snackbar>
  <v-card class="px-5 py-3 mt-3">
    <v-row align="center">
      <v-col style="width:120px" cols="auto">
        <center>
          <v-img :width="name == 'stripe' ? 120 : 87" contain position="left" :height="52" :src="icon" />
        </center>
      </v-col>
      <v-spacer />
      <v-col v-if="!gateway.wallet.available" cols="auto">
        <v-btn color="warning" :href="gateway.wallet.limitsURL" target="_blank" variant="text"
          append-icon="mdi-alert">
          Fix
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn :disabled="!gateway.wallet.available" :color="enabled ? 'primary' : null" size="small" variant="text"
          icon>
          <v-icon> mdi-cog-outline </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-switch :disabled="!gateway.wallet.available" color="primary" hide-details v-model="enabled"></v-switch>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import paypal from "@/assets/commerce/gateway/paypal.svg";
import mollie from "@/assets/commerce/gateway/mollie.svg";
import stripe from "@/assets/commerce/gateway/stripe.svg";
export default {
  props: ["gateway"],
  emits: ["linked"],
  computed: {
    icon() {
      switch (this.gateway.wallet.service.toLowerCase()) {
        case "stripe":
          return stripe;
        case "paypal":
          return paypal;
        case "mollie":
          return mollie;
      }
    },
  },
  mounted(){
    console.log(this.gateway.wallet.limitsURL)
  },
  data: () => {
    return {
      linking: false,
    }
  },
};
</script>
