<template>
  <div>
    <gateway
      name="Stripe"
      :cards="this.stripe.cards"
      :attention="requiredActions"
      url="https://dashboard.stripe.com/"
      :connected="true"
      :logo="
        require(`@/assets/gateways/stripe/${
          $vuetify.theme.dark ? 'dark' : 'light'
        }.svg`)
      "
    />
    <gateway
      name="PayPal"
      :cards="this.paypal.cards"
      :attention="requiredActions"
      url="https://www.paypal.com/mep/dashboard"
      :connected="true"
      :logo="require(`@/assets/gateways/paypal/logo.svg`)"
    />
    <gateway
      name="mollie"
      :cards="this.mollie.cards"
      :attention="false"
      url="https://mollie.com/dashboard/"
      :connected="false"
      :logo="
        require(`@/assets/gateways/mollie/${
          $vuetify.theme.dark ? 'dark' : 'light'
        }.svg`)
      "
    />
  </div>
</template>
<script>
import Gateway from "@/components/Gateway";
export default {
  components: {
    gateway: Gateway,
  },
  mounted() {
    setTimeout(() => {
      this.requiredActions = !this.requiredActions;
    }, 3000);
  },
  data: () => {
    return {
      requiredActions: false,
      paypal: {
        cards: [
          {
            name: "amex",
          },
          {
            name: "diners",
          },
          {
            name: "discover",
          },
          {
            name: "jcb",
          },
          {
            name: "mastercard",
          },
          {
            name: "visa",
          },
          {
            name: "paypal",
          },
        ],
      },
      stripe: {
        cards: [
          {
            name: "amex",
          },
          {
            name: "diners",
          },
          {
            name: "discover",
          },
          {
            name: "jcb",
          },
          {
            name: "maestro",
          },
          {
            name: "mastercard",
          },
          {
            name: "visa",
          },
          {
            variant: true,
            name: "gpay",
          },
          {
            variant: true,
            name: "apple_pay",
          },
        ],
      },
      mollie: {
        cards: [
          {
            name: "belfius",
          },
          {
            name: "giftcard",
          },
          {
            name: "inghomepay",
          },
          {
            name: "klarna",
          },
          {
            name: "mybank",
          },
          {
            name: "paysafecard",
          },
          {
            name: "voucher",
          },
        ],
      },
    };
  },
};
</script>