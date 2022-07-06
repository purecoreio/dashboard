<template>
  <v-card class="px-5 py-3">
    <v-row align="center">
      <v-col cols="auto">
        <v-img :width="120" contain position="left" :height="name == 'stripe' ? 52 : 32" :src="icon" />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn :disabled="!enabled" :color="enabled ? 'primary' : null" size="small" variant="text" icon>
          <v-icon> mdi-cog-outline </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn-toggle mandatory :disabled="!enabled" :color="enabled ? 'primary' : null" style="height: 42px"
          v-model="credit">
          <v-btn prepend-icon="mdi-circle-multiple-outline" :value="1"> Credit </v-btn>
          <v-btn prepend-icon="mdi-forwardburger" :value="0"> Forward </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto">
        <v-switch color="primary" hide-details v-model="enabled"></v-switch>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import paypal from "@/assets/commerce/gateway/paypal.svg";
import mollie from "@/assets/commerce/gateway/mollie.svg";
import stripe from "@/assets/commerce/gateway/stripe.svg";
export default {
  props: ["name", "credit", "enabled"],
  computed: {
    icon() {
      switch (this.name.toLowerCase()) {
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
