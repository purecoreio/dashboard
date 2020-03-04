<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <div>
      <v-card>
        <v-list-item v-if="guild!=null">
          <v-list-item-content>
            <v-list-item-title>{{guild.name}}</v-list-item-title>
            <v-list-item-subtitle>{{guild.uuid}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip color="primary">{{guild.memberCount}} Members</v-chip>
          </v-list-item-action>
        </v-list-item>
        <div v-if="guild==null">
          <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
        </div>
      </v-card>
    </div>
  </div>
</template>



<script>
import core from "purecore";
export default {
  data: () => ({
    create: {
      dialog: null,
      title: "",
      description: "",
      loading: false
    },
    location: [
      {
        text: "Community",
        disabled: true,
        href: ""
      },
      {
        text: "Discord",
        disabled: false,
        href: "#"
      }
    ],
    network: null,
    guild: null,
    error: ""
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.network = coreInstance.getInstance(localStorage.network).asNetwork();
    }
  },
  methods: {
    getGuild: function() {
      let main = this;
      main.guild = null;
      main.error = "";
      if (main.network != null) {
        main.network
          .getGuild()
          .then(function(guild) {
            main.error = "";
            main.guild = guild;
          })
          .catch(function(err) {
            main.error = err.message;
          });
      }
    }
  },
  watch: {
    network: function() {
      this.getGuild();
    }
  }
};
</script>
