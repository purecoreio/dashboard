<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <h2>Chat</h2>
    <v-divider style="margin-top: 20px; margin-bottom: 20px" />
    <Offence
      :offence="offence"
      v-for="offence in chatOffences"
      :key="offence.uuid"
    >{{ offence.name }}</Offence>

    <div v-if="loading">
      <v-skeleton-loader
        v-for="index in 20"
        :key="index"
        style="margin-bottom: 10px"
        height="68"
        type="list-item-two-line"
      ></v-skeleton-loader>
    </div>
    <h2 style="margin-top: 50px">Gameplay</h2>
    <v-divider style="margin-top: 20px; margin-bottom: 20px"/>
    <Offence
      :offence="offence"
      v-for="offence in gameplayOffences"
      :key="offence.uuid"
    >{{ offence.name }}</Offence>
  </div>
</template>


<script>
import core from "purecore";
import Offence from "../../components/Offence/Offence";

export default {
  name: "PunishmentsOffences",
  components: {
    Offence: Offence
  },
  data: () => ({
    location: [
      {
        text: "Punishments",
        disabled: true,
        href: ""
      },
      {
        text: "Offences",
        disabled: false,
        href: "#"
      }
    ],
    loading: true,
    chatOffences: [],
    gameplayOffences: [],
    network: null
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      this.network = localStorage.network;
      var coreInstance = new core(JSON.parse(localStorage.session));
      var network = coreInstance.getInstance(localStorage.network).asNetwork();
      var mainObj = this;

      network.getOffences().then(function(offences) {
        offences.forEach(offence => {
          if (offence.type == "GMP") {
            mainObj.gameplayOffences.push(offence);
          } else {
            mainObj.chatOffences.push(offence);
          }
        });
        mainObj.loading = false;
      });
    }
  }
};
</script>
