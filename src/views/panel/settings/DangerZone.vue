<template>
  <div>
    <v-dialog
      v-model="deleteForm"
      v-if="network != null"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text
          >Do you really want to delete {{ network.name }}.</v-card-text
        >
        <v-card-actions>
          <v-btn
            color="primary"
            :loading="deletingNetwork"
            text
            @click="deleteNetwork()"
            >Yes!</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="deleteForm = false"
            >Nope</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text
      >This feature is still under development.</v-alert
    >
    <v-list v-if="network == null">
      <v-skeleton-loader type="list-item" v-for="i in 5" :key="i" />
    </v-list>
    <v-list v-if="network != null">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Delete Network
          </v-list-item-title>
          <v-list-item-subtitle>
            Delete your entire network from purecore
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="deleteForm = true" color="primary" depressed>
            delete
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import purecore from "purecore";

export default {
  name: "DangerZone",
  data: () => ({
    deleteForm: false,
    deletingNetwork: false,
    network: null,
    location: [
      {
        text: "Settings",
        disabled: true,
        href: "",
      },
      {
        text: "Danger Zone",
        disabled: false,
        href: "#",
      },
    ],
  }),
  mounted() {
    let main = this;
    var core = new purecore(JSON.parse(localStorage.getItem("session")));
    core
      .getInstance(localStorage.getItem("network"))
      .update()
      .then(function(network) {
        main.network = network;
      });
  },
  methods: {
    deleteNetwork() {
      let main = this;
      this.deletingNetwork = true;

      this.network.delete().then(function() {
        main.deletingNetwork = false;
        main.$emit("changeNetwork");
      });
    },
  },
};
</script>
