<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
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
import plan from "../../../components/Billing/Plan";

export default {
  name: "AnalyticsInvoices",
  components: {
    Plan: plan
  },
  data: () => ({
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