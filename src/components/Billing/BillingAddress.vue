<template>
  <div>
    <v-snackbar v-model="errorShow">
      {{ errorStr }}
      <v-btn text @click="errorShow = false">Close</v-btn>
    </v-snackbar>
    <v-row class="mb-0" no-gutters>
      <v-col cols="12" class="mb-2">
        <v-text-field
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.email"
          hide-details
          outlined
          label="Email"
        />
      </v-col>
      <v-col cols="12" class="mb-2">
        <v-text-field
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.name"
          hide-details
          outlined
          label="Full Name"
        />
      </v-col>
      <v-col cols="12" class="mb-2">
        <v-select
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.country"
          :items="billing.possible"
          item-text="countryName"
          item-value="countryShortCode"
          hide-details
          @change="updateRegions"
          outlined
          label="Country"
        />
      </v-col>
      <v-col cols="12" class="mb-2">
        <v-select
          :items="billing.availableRegions"
          :disabled="billing.country==null || fetchingBilling"
          v-model="billing.state"
          item-text="name"
          item-value="name"
          hide-details
          outlined
          label="Province, Region, State"
        />
      </v-col>
      <v-col cols="8" class="mb-2 pr-2">
        <v-text-field
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.city"
          hide-details
          outlined
          label="City"
        />
      </v-col>
      <v-col cols="4" class="mb-2">
        <v-text-field
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.postalcode"
          hide-details
          outlined
          label="ZIP/Postal Code"
        />
      </v-col>
      <v-col cols="12" class="mb-2">
        <v-text-field
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.line1"
          hide-details
          outlined
          label="Line 1"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          :disabled="fetchingBilling||savingBilling"
          v-model="billing.line2"
          hide-details
          outlined
          label="Line 2 (optional)"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          :loading="savingBilling"
          @click="saveBillingAddress()"
          color="primary"
          class="mt-2"
          depressed
          large
          block
        >{{btn}}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import Core from "purecore";
import data from "country-region-data";

export default {
  props: ["btn"],
  data: () => ({
    loading: false,
    stripe: null,
    card: null,
    paymentMethods: null,
    addingCard: false,
    e1: 1,
    loadingPaymentMethods: false,
    owner: null,
    savingBilling: false,
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
    fetchingBilling: false,
  }),
  mounted() {
    var purecoreInstance = new Core(
      JSON.parse(localStorage.getItem("session"))
    );
    this.owner = purecoreInstance.getCoreSession().getUser();
    this.autofillBilling();
  },
  methods: {
    saveBillingAddress() {
      let main = this;
      this.savingBilling = true;
      this.owner
        .updateBillingAddress(this.owner.core.asBillingAddress(main.billing))
        .then(function (address) {
          main.savingBilling = false;
          main.$emit("savedBilling", address);
        })
        .catch(function (err) {
          main.savingBilling = false;
          main.showError(err.message);
        });
    },
    autofillBilling: function () {
      let main = this;
      main.fetchingBilling = true;
      this.owner
        .getBillingAddress()
        .then(function (billing) {
          main.billing.country = billing.country;
          main.updateRegions();
          main.billing.state = billing.state;
          main.billing.name = billing.name;
          main.billing.email = billing.email;
          main.billing.line1 = billing.line1;
          main.billing.line2 = billing.line2;
          main.billing.postalcode = billing.postalcode;
          main.billing.city = billing.city;
          main.fetchingBilling = false;
        })
        .catch(function (err) {
          main.error = err.message;
          main.fetchingBilling = false;
        });
    },
    updateRegions: function () {
      this.billing.availableRegions = [];
      this.billing.possible.forEach((element) => {
        if (element.countryShortCode == this.billing.country) {
          this.billing.availableRegions = element.regions;
        }
      });
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