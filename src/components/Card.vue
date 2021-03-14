<template>
  <div>
    <v-snackbar color="red" app v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-row>
      <v-col class="pb-0" cols="12">
        <!--<v-expand-transition>
          <div v-show="cards.length > 0">
            <v-card class="mb-1" outlined>
              <v-list
                :color="
                  $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'
                "
                class="ma-0 pa-0"
              >
                <v-list-item v-for="pm in cards" :key="pm.id">
                  <v-list-item-action>
                    <v-card light outlined class="pa-2">
                      <v-img
                        contain
                        height="23"
                        width="50"
                        :src="require(`@/assets/gateways/card/${pm.brand}.png`)"
                      />
                    </v-card>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      •••• {{ pm.visibleId }}
                      <v-icon v-if="pm.default">check_circle_outline</v-icon>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Added at {{ pm.creation.getDate() }}
                      {{
                        new Intl.DateTimeFormat($i18n.locale, { month: "long" })
                          .format(pm.creation)
                          .substring(0, 3)
                      }}. {{ pm.creation.getFullYear() }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <div class="text-center">
              <v-btn to="/account/billing/" class="mb-1 grey--text" text small>
                Manage saved payment methods
              </v-btn>
            </div>
            <v-divider class="mb-3" />
          </div>
        </v-expand-transition>-->
        <v-card
          outlined
          class="pt-4 pb-4 pl-1 pr-1 white-text"
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'"
        >
          <div ref="card"></div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-btn
          :loading="loading"
          :disabled="loading || created"
          @click="pay()"
          color="primary"
          depressed
          block
          large
        >
          {{ $t("startTrial") }}
        </v-btn>
        <center class="mt-1">
          <small class="grey--text">{{ $t("yourCardWillBeSaved") }}</small>
          <v-divider class="mt-2 mb-3" />
          <v-btn
            @click="pay()"
            class="mt-2"
            color="black"
            :disabled="loading || created"
            depressed
            block
            large
          >
            Google Pay
          </v-btn>
          <v-btn
            @click="pay()"
            class="mt-2"
            color="white"
            :disabled="loading || created"
            light
            depressed
            block
            large
          >
            PayPal
          </v-btn>
        </center>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { loadStripe } from "@stripe/stripe-js";
export default {
  props: ["billing"],
  data: () => {
    return {
      stripe: null,
      card: null,
      loading: false,
      created: false,
      snackbar: false,
      cards: [],
      snackbarText: "",
      style: {
        dark: {
          base: {
            color: "#ffffff",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#cccccc",
            },
            iconColor: "#ffffff",
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
        light: {
          base: {
            color: "#000000",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#cccccc",
            },
            iconColor: "#000000",
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      },
    };
  },
  methods: {
    error(err) {
      this.snackbar = true;
      this.snackbarText = err;
    },
    pay() {
      // this.$emit("start");
      let main = this;
      main.loading = true;
      main.stripe
        .createPaymentMethod({
          type: "card",
          card: main.card,
          billing_details: {
            name: main.billing.name,
            email: main.billing.email,
            address: {
              city: main.billing.city,
              country: main.billing.country,
              line1: main.billing.line1,
              line2: main.billing.line2,
              postal_code: main.billing.postalcode,
              state: main.billing.state,
            },
          },
        })
        .then(function (result) {
          // Handle result.error or result.paymentMethod
          if (result.error) {
            main.loading = false;
            main.error(result.error.message);
          } else {
            main.$purecore
              .getPlayer()
              .getBilling()
              .addPaymentMethod(result.paymentMethod.id, true)
              .then(() => {
                main.$purecore
                  .getPlayer()
                  .getBilling()
                  .subscribeWithStripe()
                  .then(() => {
                    main.$emit("start");
                    main.created = true;
                  })
                  .catch((err) => {
                    main.error(err.message);
                  })
                  .finally(() => {
                    main.loading = false;
                  });
              })
              .catch((err) => {
                main.loading = false;
                main.loading = false;
                main.error(err.message);
              });
          }
        })
        .catch((err) => {
          main.loading = false;
          main.error(err.message);
        });
    },
  },
  mounted() {
    let main = this;
    loadStripe(this.$stripeKey).then(function (Stripe) {
      main.stripe = Stripe;
      main.card = main.stripe.elements().create("card", {
        style: main.$vuetify.theme.dark ? main.style.dark : main.style.light,
      });
      main.card.mount(main.$refs.card);
    });
    this.$purecore
      .getPlayer()
      .getBilling()
      .getPaymentMethods()
      .then((pms) => {
        main.cards = pms;
      })
      .catch((err) => {
        main.error(
          "Error while loading previously saved cards: " + err.message
        );
      });
  },
};
</script>