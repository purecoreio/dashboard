<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card flat>
      <v-row no-gutters align="center">
        <v-col cols="12" md="6">
          <v-stepper v-model="e1">
            <v-stepper-header style="overflow:hidden">
              <v-stepper-step :editable="e1!=3" :complete="e1 > 1" step="1">Payment Method</v-stepper-step>

              <v-stepper-step :complete="e1 > 2" step="2">Review</v-stepper-step>

              <v-stepper-step step="3">Success</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-expand-transition>
                <v-progress-linear
                  v-show="loading || loadingPaymentMethods || addingCard"
                  class="ma-0"
                  indeterminate
                />
              </v-expand-transition>
              <v-stepper-content class="pa-2" step="1">
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
                    <v-list-item @click="fakeLoad()">
                      <v-list-item-content class="pa-0 numberFont">**** **** **** {{pm.card.last4}}</v-list-item-content>
                      <v-list-item-avatar tile>
                        <v-img
                          contain
                          :src="i==2 ? 'https://logos-marcas.com/wp-content/uploads/2020/04/Visa-Logo.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png'"
                        />
                      </v-list-item-avatar>
                      <v-list-item-action>
                        <v-btn color="primary" icon>
                          <v-icon>arrow_forward</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-alert>
                </v-list>
                <v-divider class="mt-4 mb-4" />
                <v-alert class="mb-0 pa-0" color="grey lighten-1" :text="!$vuetify.theme.dark">
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
                <v-btn class="mt-3" color="primary" text block>I don't own a credit card</v-btn>
              </v-stepper-content>

              <v-stepper-content class="pa-0" step="2">
                <v-alert class="pa-0 mb-0" text color="primary">
                  <v-list-item class="pt-5 pb-5">
                    <v-list-item-avatar>
                      <v-img contain src="../../../assets/c.png" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <b>purecore+ subscription</b>
                      <i>7-day trial, then billed monthly</i>
                    </v-list-item-content>
                    <v-list-item-action-text>
                      <span style="font-size: 14px">14.99€/MO</span>
                    </v-list-item-action-text>
                  </v-list-item>
                </v-alert>
                <div class="pa-2">
                  <v-row class="mb-0" no-gutters>
                    <v-col cols="12" class="mb-2">
                      <v-text-field hide-details outlined label="Full Name" />
                    </v-col>
                    <v-col cols="12" class="mb-2">
                      <v-autocomplete hide-details outlined label="Country" />
                    </v-col>
                    <v-col cols="12" class="mb-2">
                      <v-autocomplete hide-details outlined label="Province, Region, State" />
                    </v-col>
                    <v-col cols="8" class="mb-2 pr-2">
                      <v-text-field hide-details outlined label="City" />
                    </v-col>
                    <v-col cols="4" class="mb-2">
                      <v-text-field hide-details outlined label="ZIP/Postal Code" />
                    </v-col>
                    <v-col cols="12" class="mb-2">
                      <v-text-field hide-details outlined label="Line 1" />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field hide-details outlined label="Line 2 (optional)" />
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  @click="fakeLoad()"
                  tile
                  color="primary"
                  depressed
                  large
                  block
                >start subscription</v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <center>
                  <h1>Thank You!</h1>
                  <h4>Enjoy your new plan</h4>
                  <v-divider class="mt-4 mb-4" style="max-width: 100px" />
                  <p>Thanks to your subscription, purecore will keep working for long time</p>
                </center>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
        <v-col cols="6" v-if="$vuetify.breakpoint.mdAndUp" align="center">
          <v-img max-width="200px" contain src="../../../assets/bongo.png" />
          <v-divider class="mt-4 mb-4" style="max-width: 100px" />
          <i style="opacity:0.5">
            <b>Thanks! You are making purecore better!</b>
          </i>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>


<script>
import confetti from "canvas-confetti";
import { loadStripe } from "@stripe/stripe-js";
import Core from "purecore";

export default {
  name: "AnalyticsInvoices",
  props: ["plan"],
  data: () => ({
    loading: false,
    stripe: null,
    card: null,
    paymentMethods: null,
    addingCard: false,
    e1: 1,
    loadingPaymentMethods: false,
    owner: null,
    location: [
      {
        text: "Billing",
        disabled: true,
        href: ""
      },
      {
        text: "Invoices",
        disabled: false,
        href: "#"
      }
    ],
    complete: false,
    stripeOptions: {
      elements: {
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css?family=Barlow&display=swap"
          }
        ]
      },
      style: {
        base: {
          color: "black",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          fontFamily: "Barlow"
        }
      }
    }
  }),
  watch: {
    e1: function(val) {
      if (val == 3) {
        var interval = setInterval(() => {
          confetti({
            startVelocity: 20,
            spread: 700,
            ticks: 70,
            shapes: ["square"],
            origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2
            }
          });
        }, 200);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      }
    }
  },
  mounted() {
    let main = this;
    var purecoreInstance = new Core(
      JSON.parse(localStorage.getItem("session"))
    );
    this.owner = purecoreInstance.getCoreSession().getUser();
    loadStripe("pk_live_EApGv1EQo2QX4zp4E543Na5Q00JGPBZESa").then(function(
      Stripe
    ) {
      main.stripe = Stripe;
      main.card = main.stripe.elements().create("card");
      main.card.mount("#card-element");
    });
    this.loadPaymentMethods();
  },
  methods: {
    loadPaymentMethods() {
      this.loadingPaymentMethods = true;
      let main = this;
      main.paymentMethods = null;
      main.owner.getPaymentMethods().then(function(pm) {
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
            card: main.card
          })
          .then(d => {
            main.owner
              .addPaymentMethod(d)
              .then(function() {
                main.e1 = 2;
                main.addingCard = false;
              })
              .catch(function(err) {
                main.addingCard = false;
                main.showError(err.message);
              });
          })
          .catch(e => {
            main.addingCard = false;
            main.showError(e.message);
          });
      } catch (error) {
        main.showError(error.message);
        main.addingCard = true;
      }
    },
    fakeLoad(skip = true) {
      this.loading = true;
      let main = this;
      setTimeout(() => {
        this.loading = false;
        if (skip) {
          var newN = main.e1 + 1;
          main.e1 = newN;
        }
      }, 300);
    },
    showError(err) {
      alert(err);
    }
  }
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