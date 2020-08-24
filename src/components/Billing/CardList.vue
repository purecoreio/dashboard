<template>
  <div>
    <v-snackbar v-model="errorShow">
      {{ errorStr }}
      <v-btn text @click="errorShow = false">Close</v-btn>
    </v-snackbar>
    <div v-if="this.paymentMethods==null">
      <v-skeleton-loader class="mx-auto" type="list-item" />
    </div>
    <div v-if="this.paymentMethods!=null && this.paymentMethods.length==0">
      <center>
        <h3 class="mt-4">No previously used cards</h3>
        <p>You have not previously used a card in purecore</p>
      </center>
    </div>
    <v-list
      v-if="this.paymentMethods!=null && this.paymentMethods.length>0"
      color="transparent"
      class="mb-0 pb-0"
    >
      <v-alert
        v-for="pm in paymentMethods"
        :key="pm.id"
        class="pa-0 mb-2"
        :color="$vuetify.theme.dark ? 'white' : 'primary'"
        text
      >
        <v-list-item @click="pmid=pm.id;">
          <v-list-item-content class="pa-0 numberFont">**** **** **** {{pm.card.last4}}</v-list-item-content>
          <v-list-item-action>
            <v-card class="pl-2 pr-2 pt-1 pb-1" color="white">
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','') =='americanexpress'"
                contain
                src="@/assets/pm/American Express.png"
              />
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','')=='dinersclub'"
                contain
                src="@/assets/pm/Diners Club.svg"
              />
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','')=='discover'"
                contain
                src="@/assets/pm/Discover.svg"
              />
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','')=='jcb'"
                contain
                src="@/assets/pm/JCB.svg"
              />
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','')=='mastercard'"
                contain
                src="@/assets/pm/MasterCard.svg"
              />
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','')=='unionpay'"
                contain
                src="@/assets/pm/UnionPay.svg"
              />
              <v-img
                height="30px"
                width="60px"
                v-if="pm.card.brand.toLowerCase().replace(' ','')=='visa'"
                contain
                src="@/assets/pm/Visa.svg"
              />
            </v-card>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn color="primary" icon>
              <v-icon>arrow_forward</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-alert>
    </v-list>
    <v-divider class="mt-4 mb-4" />
    <v-alert
      class="mb-0 pa-0"
      :color="$vuetify.theme.dark ? 'white':'grey lighten-1'"
      :text="!$vuetify.theme.dark"
    >
      <div
        style="padding-top: 20px; padding-bottom: 20px; padding-left: 10px; padding-right: 10px;"
        id="card-element"
      >
        <!-- A Stripe Element will be inserted here. -->
      </div>
      <v-btn
        :loading="addingCard"
        @click="addCard()"
        color="primary"
        depressed
        large
        block
      >save and use</v-btn>
    </v-alert>
    <v-btn @click="noCreditCard()" class="mt-3" color="primary" text block>I don't own a credit card</v-btn>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import Core from "purecore";
import data from "country-region-data";

export default {
  data: () => ({
    loading: false,
    stripe: null,
    card: null,
    paymentMethods: null,
    addingCard: false,
    loadingPaymentMethods: false,
    owner: null,
    location: [
      {
        text: "Billing",
        disabled: true,
        href: "",
      },
      {
        text: "Invoices",
        disabled: false,
        href: "#",
      },
    ],
    complete: false,
    country: null,
    pmid: null,
    billing: {
      possible: data,
      availableRegions: [],
      country: null, // Two-letter country code (ISO 3166-1 alpha-2).
      state: "", // State, county, province, or region.
      city: "", // City, district, suburb, town, or village.
      line1: "", // Address line 1 (e.g., street, PO Box, or company name).
      line2: "", // Address line 2 (e.g., apartment, suite, unit, or building).
      postalcode: "", // ZIP or postal code.
      name: "",
      email: "",
    },
    errorShow: false,
    errorStr: "",
    subscribing: false,
    fetchingBilling: false,
  }),
  mounted() {

    let main = this;
    var purecoreInstance = new Core(
      JSON.parse(localStorage.getItem("session"))
    );
    this.owner = purecoreInstance.getCoreSession().getUser();
    loadStripe("pk_live_EApGv1EQo2QX4zp4E543Na5Q00JGPBZESa").then(function (
      Stripe
    ) {
      main.stripe = Stripe;
      main.card = main.stripe.elements().create("card");
      main.card.mount("#card-element");
    });
    this.loadPaymentMethods();
  },
  watch: {
    pmid(val) {
      this.$emit("creditCard", val);
    },
  },
  methods: {
    noCreditCard() {
      this.$emit("noCreditCard", true);
    },
    loadPaymentMethods() {
      this.loadingPaymentMethods = true;
      let main = this;
      main.paymentMethods = null;
      main.owner.getPaymentMethods().then(function (pm) {
        main.loadingPaymentMethods = false;
        main.paymentMethods = pm;
      });
    },
    addCard() {
      let main = this;
      main.addingCard = true;
      try {
        this.stripe
          .createPaymentMethod({
            type: "card",
            card: main.card,
          })
          .then((d) => {
            main.owner
              .addPaymentMethod(d)
              .then(function (pm) {
                main.pmid = pm.id;
                main.e1 = 2;
                main.addingCard = false;
                main.loadPaymentMethods();
              })
              .catch(function (err) {
                main.addingCard = false;
                if (!err.message.includes("undefined")) {
                  main.showError(err.message);
                }
              });
          })
          .catch((e) => {
            main.addingCard = false;
            main.showError(e.message);
          });
      } catch (error) {
        main.showError(error.message);
        main.addingCard = false;
      }
    },
    showError(err) {
      this.errorShow = true;
      this.errorStr = err;
      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300&display=swap");
.stripe-card.complete {
  border-color: green;
}
.numberFont {
  font-family: "Fira Code", monospace;
}
</style>