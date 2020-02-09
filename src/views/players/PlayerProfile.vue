<template>
  <div>
    <v-card outlined>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              {{player.username}}
              <v-icon v-if="player.verified" class="ml-2 mb-1">verified_user</v-icon>
              <v-icon v-if="!player.verified" class="ml-2 mb-1">find_replace</v-icon>
            </v-list-item-title>
            <v-list-item-subtitle>{{player.id}}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar tile size="80">
            <v-img :src="'https://minotar.net/helm/'+player.username" />
          </v-list-item-avatar>
        </v-list-item>
        <v-divider style="margin-bottom: 8px; margin-top: 8px" />
      </v-card-text>
      <v-tabs :fixed-tabs="$vuetify.breakpoint.smAndDown" class="ma-0">
        <v-tab>
          <v-icon :left="$vuetify.breakpoint.mdAndUp">payment</v-icon>
          <span v-if="$vuetify.breakpoint.mdAndUp">Payments</span>
        </v-tab>
        <v-tab>
          <v-icon :left="$vuetify.breakpoint.mdAndUp">gavel</v-icon>
          <span v-if="$vuetify.breakpoint.mdAndUp">Punishments</span>
        </v-tab>
        <v-tab>
          <v-icon :left="$vuetify.breakpoint.mdAndUp">sync_alt</v-icon>
          <span v-if="$vuetify.breakpoint.mdAndUp">Connections</span>
        </v-tab>

        <v-tab-item>
          <div v-for="payment in payments" :key="payment.uuid">
            <PaymentRow :no-shadow="true" :payment="payment"></PaymentRow>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-for="punishment in punishments" :key="punishment.uuid">
            <Punishment :no-shadow="true" :punishment="punishment"></Punishment>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-for="connection in connections" :key="connection.uuid">
            <ConnectionRow :no-shadow="true" :connection="connection"></ConnectionRow>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>


<script>
import core from "purecore";
import Punishment from "../../components/Offence/Punishment.vue";
import PaymentRow from "../../components/Payment/PaymentRow.vue";
import ConnectionRow from "../../components/Connection/ConnectionRow.vue";

export default {
  name: "PlayerProfile",
  props: ["coreid"],
  components: {
    Punishment: Punishment,
    PaymentRow: PaymentRow,
    ConnectionRow: ConnectionRow
  },
  data: () => ({
    location: [
      {
        text: "Players",
        disabled: true,
        href: ""
      },
      {
        text: "Lookup",
        disabled: true,
        href: "#"
      },
      {
        text: "Unknown",
        disabled: false,
        href: "#"
      }
    ],
    player: {
      uuid: "unknown",
      username: "unknown",
      id: "unknown",
      verified: false
    },
    payments: [],
    paymentsPage: 0,
    paymentsLoadingNew: false,
    punishments: [],
    punishmentsPage: 0,
    punishmentsLoadingNew: false,
    connections: [],
    connectionsPage: 0,
    connectionsLoadingNew: false,
    instance: null
  }),
  methods: {
    loadMoreConnections() {
      let vm = this;
      if (!vm.connectionsLoadingNew) {
        vm.connectionsLoadingNew = true;
        vm.player
          .getConnections(vm.instance.asNetwork(), vm.connectionsPage)
          .then(function(connections) {
            vm.connectionsPage++;
            vm.connectionsLoadingNew = false;
            connections.forEach(connection => {
              vm.connections.push(connection);
            });
          });
      }
    },
    loadMorePayments() {
      let vm = this;
      if (!vm.paymentsLoadingNew) {
        vm.paymentsLoadingNew = true;
        vm.player
          .getPayments(vm.instance.asNetwork().getStore(), vm.paymentsPage)
          .then(function(payments) {
            vm.paymentsPage++;
            vm.paymentsLoadingNew = false;
            payments.forEach(payment => {
              vm.payments.push(payment);
            });
          });
      }
    },
    loadMorePunishments() {
      let vm = this;
      if (!vm.punishmentsLoadingNew) {
        vm.punishmentsLoadingNew = true;
        vm.player
          .getPunishments(vm.instance.asNetwork(), vm.punishmentsPage)
          .then(function(punishments) {
            vm.punishmentsPage++;
            vm.punishmentsLoadingNew = false;
            punishments.forEach(punishment => {
              console.log(punishment);
              vm.punishments.push(punishment);
            });
          });
      }
    }
  },
  mounted: function() {
    let vm = this;

    vm.$nextTick(function() {
      var coreInstance = new core(JSON.parse(localStorage.session));
      vm.instance = coreInstance.getInstance(localStorage.network);
      var network = vm.instance.asNetwork();
      network.getPlayer(vm.coreid).then(function(player) {
        vm.player = player;
        vm.loadMoreConnections();
        vm.loadMorePayments();
        vm.loadMorePunishments();
      });
    });
  }
};
</script>
