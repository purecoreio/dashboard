<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>

    <v-row>
      <v-col cols="12" sm="6">
        <h2>Chat</h2>
        <v-divider style="margin-top: 20px; margin-bottom: 20px" />
        <OffenceAction :action="action" v-for="action in chtActions" :key="action.uuid"></OffenceAction>
        <div v-if="loading">
          <v-skeleton-loader
            v-for="index in 20"
            :key="index"
            style="margin-bottom: 10px"
            height="68"
            type="list-item-two-line"
          ></v-skeleton-loader>
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <h2>Gameplay</h2>
        <v-divider style="margin-top: 20px; margin-bottom: 20px" />
        <OffenceAction :action="action" v-for="action in gmpActions" :key="action.uuid"></OffenceAction>
        <div v-if="loading">
          <v-skeleton-loader
            v-for="index in 20"
            :key="index"
            style="margin-bottom: 10px"
            height="68"
            type="list-item-two-line"
          ></v-skeleton-loader>
        </div>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import core from "purecore";
import OffenceAction from "../../components/Offence/Action";

export default {
  name: "PunishmentsActions",
  components: {
    OffenceAction: OffenceAction
  },
  data: () => ({
    location: [
      {
        text: "Punishments",
        disabled: true,
        href: ""
      },
      {
        text: "Actions",
        disabled: false,
        href: "#"
      }
    ],
    loading: true,
    chtActions: [],
    gmpActions: []
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      this.network = localStorage.network;
      var coreInstance = new core(JSON.parse(localStorage.session));
      var network = coreInstance.getInstance(localStorage.network).asNetwork();
      var mainObj = this;

      network.getOffenceActions().then(function(actions) {
        actions.forEach(action => {
          if (action.pointsType == "CHT") {
            mainObj.chtActions.push(action);
          } else {
            mainObj.gmpActions.push(action);
          }
        });
        mainObj.loading = false;
      });
    }
  }
};
</script>
