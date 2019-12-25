<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>

    <div v-if="servers.length > 1">
      <ServerRow v-show="true" name="Proxy Instance" :uuid="network"></ServerRow>
      <v-divider style="margin-top: 10px; margin-bottom: 10px"></v-divider>
    </div>

    <div v-for="server in servers" :key="server.uuid">
      <ServerRow :name="server.name" :uuid="server.uuid"></ServerRow>
    </div>

    <!-- dialog -->

    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Add Server</v-btn>
      </template>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Define</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">Setup</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Instance Name*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-layout row wrap justify-end>
                  <v-flex shrink>
                    <v-btn text @click="dialog = false;e1=1">Cancel</v-btn>
                    <v-btn color="primary" @click="e1=2" style="margin-right: 10px">Next</v-btn>
                  </v-flex>
                </v-layout>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12" md="10" sm="12">
                <v-text-field
                  type="password"
                  value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
                  disabled
                  label="Key"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2" sm="12">
                <v-btn block text color="primary">Copy</v-btn>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" md="5" sm="12">
                <v-btn block color="primary" outlined>Plugin (.jar)</v-btn>
              </v-col>
              <v-col cols="12" md="2" sm="12" class="text-center">
                <v-container>
                  <v-row justify="center">Or</v-row>
                </v-container>
              </v-col>
              <v-col cols="12" md="5" sm="12">
                <v-btn block color="primary" outlined>Plugin + Config (.zip)</v-btn>
              </v-col>
              <v-col cols="12">
                <v-layout row wrap justify-end>
                  <v-flex shrink>
                    <v-btn text @click="dialog = false;e1=1" style="margin-right: 10px">Close</v-btn>
                  </v-flex>
                </v-layout>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

    <!-- dialog finish -->
  </div>
</template>


<script>
import ServerRow from "../../components/Instance/ServerRow";
import core from "purecore";

export default {
  name: "ServersList",
  components: {
    ServerRow: ServerRow
  },
  data: () => ({
    session: null,
    servers: [],
    location: [
      {
        text: "Servers",
        disabled: true,
        href: ""
      },
      {
        text: "List",
        disabled: false,
        href: "#"
      }
    ],
    dialog: false,
    e1: 1,
    network: null
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      network = localStorage.network;
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.session = coreInstance.getCoreSession();
      var network = coreInstance.getInstance(localStorage.network).asNetwork();
      var mainObj = this;
      network.getServers().then(function(servers) {
        mainObj.servers = servers;
      });
    }
  }
};
</script>
