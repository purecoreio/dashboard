<template>
  <v-snackbar v-model="error">
    {{ error }}
  </v-snackbar>
  <v-card class="px-5 py-3 mb-3">
    <v-row align="center">
      <v-col style="width:120px" cols="auto">
        <center>
          <v-img :width="name == 'stripe' ? 120 : 87" contain position="left" :height="52" :src="icon" />
        </center>
      </v-col>
      <v-spacer />
      <v-col v-if="linked" cols="auto">
        <v-btn :disabled="!enabled" :color="enabled ? 'primary' : null" size="small" variant="text" icon>
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
      <v-col v-if="linked" cols="auto">
        <v-switch color="primary" hide-details v-model="enabled"></v-switch>
      </v-col>
      <v-col v-if="!linked" cols="auto">
        <v-btn @click="link" variant="text" append-icon="mdi-shape-circle-plus">
          Link
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
  props: ["name", "credit", "enabled", "linked"],
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
  data: () => {
    return {
      linking: false,
      error: null
    }
  },
  methods: {
    showError(error) {
      this.error = error
      setTimeout(() => {
        this.error = null
      }, 3000);
    },
    async link(privateKey = null, publicKey = null) {
      this.linking = true
      try {
        await this.context.user.linkWallet(this.name, privateKey, publicKey)
      } catch (error) {
        this.showError(error.message)
      }
      this.linking = false
    }
  }
};
</script>
