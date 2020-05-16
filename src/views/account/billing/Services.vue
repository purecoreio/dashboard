<template>
  <div>
    <v-breadcrumbs v-if="false" :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert
      color="primary"
      text
      v-if="false"
    >We don't believe that we should charge for a work in progress service, all this features are free until we consider that we are ready to present them officially.</v-alert>

    <v-card outlined :class="($vuetify.breakpoint.smAndUp ? 'pa-10' : 'pa-1') + ' mb-4'">
      <section>
        <center>
          <h1>purecore premium+ features</h1>
          <v-divider class="mt-4 mb-4" />
        </center>
        <v-row>
          <v-col cols="6" sm="4" v-for="(feature,i) in featuresPremiumPlus" :key="i">
            <v-icon x-large color="primary">{{feature.icon}}</v-icon>
            <p class="mb-0 mt-2">
              <b>
                <big>{{feature.title}}</big>
              </b>
            </p>
            <p>{{feature.description}}</p>
            <v-chip>{{feature.prev}}</v-chip>
          </v-col>
        </v-row>
        <center>
          <v-btn
            :to="{ name: 'Invoices' , params: { plan: 'premium_plus'} }"
            color="primary"
            class="mt-4"
            depressed
            rounded
            x-large
          >subscribe 9.99€/m</v-btn>
          <div>
            <v-btn
              :to="{ name: 'Invoices' , params: { plan: 'premium_plus_v'} }"
              class="mt-4 mb-2"
              small
              depressed
              rounded
            >or 14.99€/m + 2€/200,000 extra connections</v-btn>
          </div>
          <p class="pb-0" style="opacity:0.5">
            <small>billed automatically using Stripe or PayPal</small>
          </p>
        </center>
      </section>
    </v-card>
    <v-card outlined :class="$vuetify.breakpoint.smAndUp ? 'pa-10' : 'pa-1'">
      <section>
        <center>
          <h1>purecore premium (standard) features</h1>
          <v-divider class="mt-4 mb-4" />
        </center>
        <v-row>
          <v-col cols="6" sm="4" v-for="(feature,i) in featuresPremium" :key="i">
            <v-icon x-large color="primary">{{feature.icon}}</v-icon>
            <p class="mb-0 mt-2">
              <b>
                <big>{{feature.title}}</big>
              </b>
            </p>
            <p>{{feature.description}}</p>
            <v-chip>{{feature.prev}}</v-chip>
          </v-col>
        </v-row>
        <center>
          <v-btn
            :to="{ name: 'Invoices' , params: { plan: 'premium'} }"
            color="primary"
            class="mt-4"
            depressed
            rounded
            x-large
          >subscribe 4.99€/m</v-btn>
          <p class="pb-0" style="opacity:0.5">
            <small>billed automatically using Stripe or PayPal</small>
          </p>
        </center>
      </section>
    </v-card>
    <v-alert
      class="mt-4"
      text
      color="primary"
    >When you subscribe to any plan, the features will apply to all your existing networks, you don't need to pay the plan for each network you own. Your game sessions/connections are counted globally across your networks.</v-alert>
    <div v-if="plans==null">
      <v-progress-linear indeterminate></v-progress-linear>
    </div>
    <div v-if="plans!=null">
      <v-row>
        <v-col cols="6" md="3" v-for="plan in plans" :key="plan.uuid">
          <Plan :plan="plan" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import core from "purecore";
// import plan from "../../../components/Billing/Plan";

export default {
  name: "AnalyticsInvoices",
  /* components: {
    Plan: plan
  },*/
  data: () => ({
    featuresPremium: [
      {
        icon: "scatter_plot",
        title: "8-hour analytic resolution",
        description:
          "see exactly what's going on with your community on the go",
        prev: "24h for free"
      },
      {
        icon: "local_mall",
        title: "1,000 EUR payment limit",
        description: "1,000 EUR limit to your revenue",
        prev: "500 EUR for free"
      },
      {
        icon: "local_offer",
        title: "store coupons",
        description: "big-brain economic moves for ya",
        prev: "not included for free"
      },
      {
        icon: "meeting_room",
        title: "200,000 monthly game sessions",
        description: "200,000 included monthly connections",
        prev: "50,000 for free"
      },
      {
        icon: "format_shapes",
        title: "unofficial CMS components",
        description:
          "use components from our component market or create your own vue-based components",
        prev: "not included for free"
      },
      {
        icon: "widgets",
        title: "12 instances per network",
        description: "12 instances inside your networks",
        prev: "6 for free"
      }
    ],
    featuresPremiumPlus: [
      {
        icon: "description",
        title: "CSV & XLS exporting",
        description: "because playing with numbers it's always fun",
        prev: "not included in standard"
      },
      {
        icon: "scatter_plot",
        title: "30-minute analytic resolution",
        description:
          "see exactly what's going on with your community on the go",
        prev: "8h in standard"
      },
      {
        icon: "local_mall",
        title: "unlimited payments",
        description: "no limits to your revenue other than your success",
        prev: "1,000 EUR in standard"
      },
      {
        icon: "local_offer",
        title: "store coupons & sales",
        description: "big-brain economic moves for ya",
        prev: "only coupons included in standard"
      },
      {
        icon: "space_bar",
        title: "console access",
        description:
          "your server console - even if you are not hosting on purecore - from your panel",
        prev: "not included in standard"
      },
      {
        icon: "dns",
        title: "machine supervisor",
        description:
          "install purecore's surpervisor on your dedicated machine to deploy instances from your panel",
        prev: "not included in standard"
      },
      {
        icon: "vpn_lock",
        title: "GRS",
        description:
          "get alerts from potential hackers and player behavior thanks to our global reputation system",
        prev: "not included in standard"
      },
      {
        icon: "meeting_room",
        title: "500,000 monthly game sessions",
        description: "500,000 included monthly connections, need more?",
        prev: "200,000 included in standard"
      },
      {
        icon: "insert_emoticon",
        title: "discord emojis on your forum",
        description:
          "react to your forum posts with the linked discord guild emojis",
        prev: "not included in standard"
      },
      {
        icon: "format_shapes",
        title: "unofficial CMS components",
        description:
          "use components from our component market or create your own vue-based components",
        prev: "included in standard"
      },
      {
        icon: "drafts",
        title: "customizable notifications",
        description:
          "send push notifications to your customers with custom URLs, or modify your email server and design",
        prev: "not included in standard"
      },
      {
        icon: "widgets",
        title: "unlimited instances",
        description: "unlimited instances inside your networks",
        prev: "12 in standard"
      }
    ],
    location: [
      {
        text: "Billing",
        disabled: true,
        href: ""
      },
      {
        text: "Plan & Services",
        disabled: false,
        href: "#"
      }
    ],
    plans: null
  }),
  mounted() {
    var purecore = new core();
    let main = this;
    purecore
      .getPlans()
      .then(function(data) {
        main.plans = data;
      })
      .catch(function(err) {
        main.error = err.message;
      });
  }
};
</script>