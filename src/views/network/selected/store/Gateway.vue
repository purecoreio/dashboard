<template>
  <v-alert :rounded="0" class="mb-3">
    When credit fallback is enabled, you'll be able to receive payments in the form of purecore credit even if there are
    no wallets available for that given gateway. You can use purecore credit to pay for purecore+, purecore hosting or
    other purecore-related expenses. Whenever a wallet is available, it will be used and you'll directly receive your
    founds.
  </v-alert>
  <v-row>
    <v-col v-for="service in services" :key="service">
      <service :store="store" :name="service" @linked="updateWalletsMultiple()" />
    </v-col>
  </v-row>
  <v-progress-linear class="mt-3" indeterminate v-if="loading" />
  <gateway v-for="gateway in gateways" :key="gateway.id" :gateway="gateway" />
</template>
<script>
import gateway from "@/components/commerce/Gateway.vue";
import Service from '../../../../components/commerce/Service.vue';
export default {
  props: ["network"],
  components: {
    gateway,
    Service
  },
  data: () => {
    return {
      services: ["paypal", "stripe", "mollie"],
      store: null,
      gateways: [],
      loading: false,
    }
  },
  async mounted() {
    this.store = await this.network.getStore()
    await this.updateGateways()
    await this.store.getCheckout()
  },
  methods: {
    async updateGateways() {
      this.loading = true
      this.gateways = await this.store.getGateways()
      this.loading = false
    },
    async updateWalletsMultiple() {
      const len = this.gateways.length
      for (let i = 0; i < 6; i++) {
        await this.updateGateways()
        if (len != this.gateways.length) break;
        if(i==0)
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }
};
</script>
