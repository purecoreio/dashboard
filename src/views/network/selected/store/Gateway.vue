<template>
  <v-alert class="mb-5">
    When using credit, your income will be saved as purecore credit, which you can use to
    pay for purecore hosting, purecore+ or other purecore-related expenses. The credit will be saved on
    the account of the owner of this network. If you want the funds to go directly to your
    account, select forward and you'll be able to link your account for any given service.
  </v-alert>
  <gateway class="mb-5" name="paypal" :credit="0" :enabled="true" />
  <gateway class="mb-5" name="stripe" :credit="1" :enabled="true" />
  <gateway name="mollie" :credit="1" :enabled="false" />
</template>
<script>
import gateway from "@/components/commerce/Gateway.vue";
export default {
  components: {
    gateway,
  },
};
</script>
