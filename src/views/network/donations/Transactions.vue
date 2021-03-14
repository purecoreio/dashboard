<template>
  <div>
    <revenueGraph />
    <div class="pt-4">
      <v-card
        class="pt-1 pb-1 mb-2"
        outlined
        v-for="payment in payments"
        :key="payment.id"
      >
        <v-list-item>
          <v-list-item-avatar>
            <img
              :src="`https://minotar.net/helm/${payment.profile.platformUsername}`"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-row align="center" no-gutters>
              <v-col class="flex-grow-0 flex-shrink-1">
                <v-list-item-title style="min-width: 130px">
                  {{ payment.profile.platformUsername }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ payment.paid.toLocaleString() }}
                </v-list-item-subtitle>
              </v-col>
              <v-col
                v-if="$vuetify.breakpoint.mdAndUp"
                class="pl-3 flex-grow-0 flex-shrink-1"
              >
                <v-img
                  width="70px"
                  v-if="payment.gateway == 0 && $vuetify.theme.dark"
                  contain
                  src="@/assets/gateways/stripe/dark.svg"
                />
                <v-img
                  width="70px"
                  v-if="payment.gateway == 0 && !$vuetify.theme.dark"
                  contain
                  src="@/assets/gateways/stripe/light.svg"
                />
                <v-img
                  width="70px"
                  v-if="payment.gateway == 1 && $vuetify.theme.dark"
                  contain
                  src="@/assets/gateways/paypal/dark.svg"
                />
                <v-img
                  width="70px"
                  v-if="payment.gateway == 1 && !$vuetify.theme.dark"
                  contain
                  src="@/assets/gateways/paypal/light.svg"
                />
              </v-col>
              <v-col
                v-if="$vuetify.breakpoint.mdAndUp"
                class="text-right flex-grow-1 flex-shrink-0"
              >
                <v-tooltip class="mr-1" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      label
                      v-bind="attrs"
                      v-on="on"
                      v-if="payment.refunded != null"
                    >
                      Refunded
                    </v-chip>
                  </template>
                  <span v-if="payment.refunded != null">{{
                    payment.refunded.toLocaleString()
                  }}</span>
                </v-tooltip>
                <v-tooltip class="mr-1" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      label
                      v-bind="attrs"
                      v-on="on"
                      v-if="
                        payment.dispute != null && payment.disputeClosed == null
                      "
                    >
                      Open Dispute
                    </v-chip>
                  </template>
                  <span v-if="payment.dispute != null">{{
                    payment.dispute.toLocaleString()
                  }}</span>
                </v-tooltip>
                <v-tooltip class="mr-1" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      label
                      v-bind="attrs"
                      v-on="on"
                      v-if="payment.disputeClosed != null"
                    >
                      Closed Dispute
                    </v-chip>
                  </template>
                  <span v-if="payment.disputeClosed != null">{{
                    payment.disputeClosed.toLocaleString()
                  }}</span>
                </v-tooltip>
              </v-col>
              <v-col
                :class="
                  $vuetify.breakpoint.mdAndUp
                    ? 'flex-grow-0 flex-shrink-1'
                    : 'flex-grow-1 flex-shrink-0'
                "
              >
                <v-tooltip class="mr-1" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      style="min-width: 70px; float: right"
                    >
                      <center>
                        <b>{{
                          (Math.round(payment.amount * 100) / 100).toFixed(2)
                        }}</b
                        ><br />
                        {{ payment.currency }}
                      </center>
                    </div>
                  </template>
                  <span v-if="payment.refunded == null"
                    >{{ (Math.round(payment.net * 100) / 100).toFixed(2) }}
                    {{ payment.currency }}</span
                  >
                  <span v-if="payment.refunded != null"
                    >{{
                      Math.round((payment.net - payment.amount) * 100) / 100
                    }}
                    {{ payment.currency }}</span
                  >
                </v-tooltip>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <div v-if="loading">
        <v-skeleton-loader
          v-for="i in 20"
          :key="i"
          class="mx-auto mb-2"
          type="list-item-avatar-two-line"
        ></v-skeleton-loader>
      </div>
      <div ref="end">
        <center v-if="lastTimestamp != null">
          end - {{ lastTimestamp.toLocaleString() }}
        </center>
      </div>
    </div>
  </div>
</template>

<script>
import revenueGraph from "@/components/analytic/Revenue";
export default {
  components: {
    revenueGraph,
  },
  name: "Transactions",
  data: () => {
    return {
      items: ["December"],
      selected: "December",
      analytics: null,
      series: null,
      payments: [],
      lastTimestamp: null,
      loading: false,
      stopQuerying: false,
    };
  },
  mounted() {
    this.scroll();
    this.query();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    scrollHandler() {
      {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight >=
          document.documentElement.offsetHeight - 400;

        if (bottomOfWindow) {
          this.query();
        }
      }
    },
    scroll() {
      window.addEventListener("scroll", this.scrollHandler);
    },
    query() {
      if (!this.loading && !this.stopQuerying) {
        let main = this;
        main.loading = true;
        this.$purecore
          .getContext()
          .getNetwork()
          .asStore()
          .getPayments(
            main.lastTimestamp != null
              ? main.lastTimestamp / 1000
              : new Date().getTime() / 1000
          )
          .then((payments) => {
            if (payments.length <= 0) {
              main.stopQuerying = true;
              console.log(main.stopQuerying);
            } else {
              for (let i = 0; i < payments.length; i++) {
                const element = payments[i];
                main.payments.push(element);
                if (i == payments.length - 1) {
                  main.lastTimestamp = element.paid;
                }
              }
            }
          })
          .finally(() => {
            main.loading = false;
          });
      }
    },
  },
};
</script>