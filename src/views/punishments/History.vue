<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <div>
      <Punishment
        v-for="punishment in punishments"
        :key="punishment.uuid"
        :punishment="punishment"
      />
    </div>
    <div v-intersect="loadContent"></div>
    <div v-if="loadingNew">
      <v-skeleton-loader
        v-for="index in 20"
        :key="index"
        style="margin-bottom: 10px"
        height="68"
        type="list-item-two-line"
      ></v-skeleton-loader>
    </div>
  </div>
</template>


<script>
import core from "purecore";
import Punishment from "../../components/Offence/Punishment";

export default {
  name: "PunishmentsHistory",
  components: {
    Punishment: Punishment
  },
  data: () => ({
    location: [
      {
        text: "Punishments",
        disabled: true,
        href: ""
      },
      {
        text: "History",
        disabled: false,
        href: "#"
      }
    ],
    punishments: [],
    loadingNew: false,
    page: 0
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

        network.getPunishments(mainObj.page).then(function(punishments) {
          punishments.forEach(punishment => {
            mainObj.punishments.push(punishment);
          });

          mainObj.loadingNew = false;
          mainObj.page++;
        });
      }
    }
  }
};
</script>
