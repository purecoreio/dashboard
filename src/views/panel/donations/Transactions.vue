<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <div v-for="payment in payments" :key="payment.uuid">
      <PaymentRow :payment="payment"></PaymentRow>
    </div>
    <div v-intersect="loadContent"></div>
    <div v-if="loadingNew">
      <v-skeleton-loader v-for="index in 20" :key="index" style="margin-bottom: 10px" height="68" type="list-item-two-line"></v-skeleton-loader>
    </div>
  </div>
</template>


<script>
import core from "purecore";
import PaymentRow from "../../../components/Payment/PaymentRow";

export default {
  name: "DonationsTransactions",
  components: {
    PaymentRow: PaymentRow
  },
  data: () => ({
    location: [
      {
        text: "Donations",
        disabled: true,
        href: ""
      },
      {
        text: "Transactions",
        disabled: false,
        href: "#"
      }
    ],
    payments: [],
    page: 0,
    loadingNew: false
  }),
  methods: {
    loadContent() {
      if (!this.loadingNew && localStorage.session && localStorage.network) {
        this.loadingNew = true;
        network = localStorage.network;
        var coreInstance = new core(JSON.parse(localStorage.session));
        var network = coreInstance
          .getInstance(localStorage.network)
          .asNetwork();
        var mainObj = this;

        network
          .getStore()
          .getPayments(mainObj.page)
          .then(function(payments) {
            payments.forEach(payment => {
              mainObj.payments.push(payment);
            });

            mainObj.loadingNew = false;
            mainObj.page++;
          });
      }
    }
  },
  mounted() {}
};
</script>
