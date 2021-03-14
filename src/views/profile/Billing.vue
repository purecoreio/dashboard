<template>
  <div>
    <v-snackbar color="red" app v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog v-model="addingPaymentMethod" width="500">
      <v-card>
        <v-card-title> {{ $t("addPaymentMethod") }} </v-card-title>

        <v-card-text>
          <v-card
            outlined
            class="pt-4 pb-4 pl-1 pr-1 white-text"
            :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3'"
          >
            <div ref="card_add"></div>
          </v-card>

          <center class="mt-4">
            <small class="grey--text">
              {{ $t("yourCardWillBeSaved") }}
            </small>
          </center>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            :disabled="pushingPaymentMethod"
            text
            @click="addingPaymentMethod = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-spacer></v-spacer>
          <secure />
          <v-btn
            color="primary"
            :loading="pushingPaymentMethod"
            :disabled="pushingPaymentMethod"
            depressed
            class="ml-2"
            @click="addMethod()"
          >
            {{ $t("add") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- payment methods -->

    <v-row align="center" class="pl-2 pb-1 pr-4" no-gutters>
      <v-col class="flex-grow-1 flex-shrink-0">
        <p class="overline ma-0">Payment Methods</p>
      </v-col>
      <v-col class="flex-grow-0 flex-shrink-1">
        <v-btn @click="addingPaymentMethod = true" icon>
          <v-icon> add </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card outlined>
      <div v-if="loadingPms">
        <v-skeleton-loader
          class="mx-auto mt-1 mb-1"
          type="list-item-avatar-two-line"
        ></v-skeleton-loader>
      </div>
      <div v-if="!loadingPms && pms.length <= 0">
        <center>
          <h3 class="mt-6 mb-6">{{ $t("noSavedPaymentMethod") }}</h3>
        </center>
      </div>
      <v-list v-if="!loadingPms && pms.length > 0">
        <v-list-item v-for="pm in pms" :key="pm.id">
          <v-list-item-action>
            <v-card light outlined class="pa-2">
              <v-img
                contain
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
          <v-list-item-action>
            <v-menu transition="scale">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon dark v-bind="attrs" v-on="on">
                  <v-icon> more_vert </v-icon>
                </v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item @click="removePm(pm)">
                  <v-list-item-action>
                    <v-icon> delete </v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Remove</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setDefaultPm(pm)" :disabled="pm.default">
                  <v-list-item-action>
                    <v-icon> check_circle_outline </v-icon>
                  </v-list-item-action>
                  <v-list-item-title>
                    {{ $t("setAsDefault") }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <!-- billing address -->

    <v-row align="center" class="pl-2 pr-4 pb-1 pt-4" no-gutters>
      <v-col class="flex-grow-1 flex-shrink-0">
        <p class="overline ma-0">
          {{ $t("billingAddress") }}
        </p>
      </v-col>
    </v-row>
    <v-card class="mb-7 pl-4 pt-2 pb-2 pr-4" outlined>
      <v-row>
        <v-col cols="12">
          <v-text-field
            hide-details
            solo-inverted
            :placeholder="$t('fullName')"
            v-model="address.name"
            :disabled="settingAddress"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="address.email"
            hide-details
            solo-inverted
            :disabled="settingAddress"
            :placeholder="$t('email')"
          />
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="address.country"
            :items="possible"
            :disabled="settingAddress"
            item-text="countryName"
            item-value="countryShortCode"
            hide-details
            :label="$t('country')"
            solo-inverted
            @change="updateRegions"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="availableRegions"
            :disabled="address.country == null || settingAddress"
            v-model="address.state"
            item-text="name"
            item-value="name"
            hide-details
            solo-inverted
            :label="$t('province')"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details
            :disabled="settingAddress"
            v-model="address.city"
            solo-inverted
            :placeholder="$t('city')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details
            :disabled="settingAddress"
            v-model="address.postalcode"
            solo-inverted
            :placeholder="$t('postCode')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="address.line1"
            hide-details
            :disabled="settingAddress"
            solo-inverted
            :placeholder="$t('line1')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="address.line2"
            hide-details
            :disabled="settingAddress"
            solo-inverted
            :placeholder="$t('line2')"
          />
        </v-col>
        <v-col cols="12" class="text-right">
          <secure />
          <v-btn
            class="ml-2"
            @click="updateAddress()"
            :disabled="settingAddress"
            :loading="settingAddress"
            color="primary"
          >
            <v-icon class="mr-2">save</v-icon>
            {{ $t("save") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import countryData from "country-region-data";
import { loadStripe } from "@stripe/stripe-js";

export default {
  mounted() {
    this.getCards();
    this.getAddress();

    let main = this;
    loadStripe(this.$stripeKey).then(function (Stripe) {
      main.stripe = Stripe;
      main.card = main.stripe.elements().create("card", {
        style: main.$vuetify.theme.dark ? main.style.dark : main.style.light,
      });
    });
  },
  watch: {
    addingPaymentMethod(newv) {
      if (newv) {
        this.$nextTick(function () {
          this.card.mount(this.$refs.card_add);
        });
      }
    },
  },
  data: () => {
    return {
      snackbar: false,
      snackbarText: "",
      pms: [],
      loadingPms: false,
      settingAddress: false,
      stripe: null,
      card: null,
      possible: countryData,
      availableRegions: [],
      addingPaymentMethod: false,
      pushingPaymentMethod: false,
      address: {
        name: null,
        email: null,
        country: null,
        state: null,
        city: null,
        postalcode: null,
        line1: null,
        line2: null,
      },
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
    addMethod() {
      let main = this;
      main.pushingPaymentMethod = true;
      main.stripe
        .createPaymentMethod({
          type: "card",
          card: main.card,
          billing_details: {
            name: main.address.name,
            email: main.address.email,
            address: {
              city: main.address.city,
              country: main.address.country,
              line1: main.address.line1,
              line2: main.address.line2,
              postal_code: main.address.postalcode,
              state: main.address.state,
            },
          },
        })
        .then(function (result) {
          // Handle result.error or result.paymentMethod
          if (result.error) {
            main.pushingPaymentMethod = false;
            main.error(result.error.message);
          } else {
            main.$purecore
              .getPlayer()
              .getBilling()
              .addPaymentMethod(result.paymentMethod.id, true)
              .then(() => {
                main.addingPaymentMethod = false;
                main.getCards();
              })
              .catch((err) => {
                main.pushingPaymentMethod = false;
                main.error(err.message);
              })
              .finally(() => {
                main.pushingPaymentMethod = false;
              });
          }
        })
        .catch((err) => {
          main.pushingPaymentMethod = false;
          main.error(err.message);
        });
    },
    error(err) {
      this.snackbar = true;
      this.snackbarText = err;
    },
    updateAddress: function () {
      let main = this;
      main.settingAddress = true;
      this.$purecore
        .getPlayer()
        .getBilling()
        .setBillingAddress(this.address)
        .then(() => {
          main.e1 = 2;
        })
        .catch((err) => {
          main.error(err.message);
        })
        .finally(() => {
          main.settingAddress = false;
        });
    },
    updateRegions: function () {
      this.address.availableRegions = [];
      for (let i = 0; i < this.possible.length; i++) {
        const element = this.possible[i];
        if (element.countryShortCode == this.address.country) {
          this.availableRegions = element.regions;
          break;
        }
      }
    },
    removePm(pm) {
      let main = this;
      main.loadingPms = true;
      this.$purecore
        .getPlayer()
        .getBilling()
        .detachPaymentMethod(pm)
        .finally(() => {
          main.getCards();
        });
    },
    setDefaultPm(pm) {
      let main = this;
      main.loadingPms = true;
      this.$purecore
        .getPlayer()
        .getBilling()
        .addPaymentMethod(pm, true)
        .finally(() => {
          main.getCards();
        });
    },
    getAddress() {
      let main = this;
      main.settingAddress = true;
      this.$purecore
        .getPlayer()
        .getBilling()
        .getBillingAddress()
        .then((address) => {
          let addressObj = address.asObject();
          for (const key in addressObj) {
            if (Object.hasOwnProperty.call(addressObj, key)) {
              const element = addressObj[key];
              if (key in main.address) {
                main.address[key] = element;
                if (key == "country") {
                  main.updateRegions();
                }
              }
            }
          }
        })
        .finally(() => {
          main.settingAddress = false;
        });
    },
    getCards() {
      let main = this;
      main.loadingPms = true;
      this.$purecore
        .getPlayer()
        .getBilling()
        .getPaymentMethods()
        .then((pms) => {
          main.pms = pms;
        })
        .finally(() => {
          main.loadingPms = false;
        })
        .catch((err) => {
          main.error(err.message);
        });
    },
  },
};
</script>