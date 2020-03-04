<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>

    <div v-if="servers.length > 1 && network != null">
      <ServerRow v-show="true" name="Proxy Instance" :uuid="network.uuid"></ServerRow>
      <v-divider style="margin-top: 10px; margin-bottom: 10px"></v-divider>
    </div>

    <div v-if="loadingNew">
      <v-skeleton-loader
        v-for="index in 10"
        :key="index"
        style="margin-bottom: 10px"
        height="68"
        type="list-item-two-line"
      ></v-skeleton-loader>
    </div>

    <div v-for="server in servers" :key="server.uuid">
      <ServerRow :name="server.name" :uuid="server.uuid"></ServerRow>
    </div>

    <!-- dialog -->

    <v-dialog v-model="setup.active" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn style="float: right" color="primary" dark v-on="on">Add Server</v-btn>
      </template>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Define</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">Setup</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-expand-transition>
              <v-alert text color="primary" v-show="setup.error!=null">{{setup.error}}</v-alert>
            </v-expand-transition>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="setup.name" outlined label="Instance Name*" required></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="px-3">
              <v-col cols="6">
                <v-layout row wrap justify-start>
                  <v-flex shrink>
                    <v-btn
                      outlined
                      color="secondary"
                      v-if="(setup.mode=='view'||setup.mode=='single')||(setup.mode=='proxy'&&servers.length>1)"
                      @click="setup.active = false;e1=1"
                    >CANCEL</v-btn>
                  </v-flex>
                </v-layout>
              </v-col>
              <v-col cols="6">
                <v-layout row wrap justify-end>
                  <v-flex shrink>
                    <v-btn depressed color="primary" @click="createServer()">NEXT</v-btn>
                  </v-flex>
                </v-layout>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-expand-transition>
              <div v-show="!setup.created">
                <center style="padding-top: 50px; padding-bottom: 50px">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </center>
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <div v-show="setup.created">
                <v-row justify="center" align="center">
                  <v-col cols="8" md="9" sm="12">
                    <v-text-field
                      type="password"
                      hide-details
                      :loading="setup.key.loading"
                      :value="setup.key.value"
                      disabled
                      label="Key"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" md="3" sm="12">
                    <v-btn
                      @click="copyKey()"
                      :disabled="setup.key.loading"
                      :loading="setup.key.loading"
                      block
                      text
                      outlined
                      color="primary"
                    >Copy</v-btn>
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <v-row v-show="false">
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
                      <v-alert
                        text
                        color="primary"
                        v-if="shouldAskProxy"
                      >You should add at least two instances before setting up your proxy instance</v-alert>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                <v-row no-gutters class="px-3">
                  <v-col cols="6">
                    <v-layout row wrap justify-start>
                      <v-flex shrink>
                        <v-btn
                          outlined
                          color="secondary"
                          v-if="(setup.mode=='view'||setup.mode=='single')||(setup.mode=='proxy'&&servers.length>1)"
                          @click="setup.active = false;e1=1"
                        >CLOSE</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-col>
                  <v-col cols="6">
                    <v-layout row wrap justify-end>
                      <v-flex shrink>
                        <v-btn
                          depressed
                          color="primary"
                          v-if="setup.mode=='proxy'"
                          @click="createAnother()"
                        >ADD ANOTHER</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

    <v-dialog v-model="setup.proxyAsking" persistent max-width="400px">
      <v-card class="pa-5">
        <h2>Setup proxy now?</h2>
        <p>Do you want to setup your proxy instance already? Or do you prefer keep adding servers?</p>
        <v-divider class="mt-4 mb-4" />
        <v-row no-gutters class="px-3">
          <v-col cols="6">
            <v-layout row wrap justify-start>
              <v-flex shrink>
                <v-btn outlined color="secondary" @click="setup.proxyAsking = false">KEEP ADDING</v-btn>
              </v-flex>
            </v-layout>
          </v-col>
          <v-col cols="6">
            <v-layout row wrap justify-end>
              <v-flex shrink>
                <v-btn
                  depressed
                  color="primary"
                  @click="setup.active=false;setup.proxyAsking=false;"
                >SETUP</v-btn>
              </v-flex>
            </v-layout>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- dialog finish -->
  </div>
</template>


<script>
import ServerRow from "../../../components/Instance/ServerRow";
import core from "purecore";

export default {
  name: "ServersList",
  components: {
    ServerRow: ServerRow
  },
  props: ["mode"],
  data: () => ({
    setup: {
      mode: null,
      created: false,
      proxyAsked: false,
      active: false,
      proxyAsking: false,
      error: null,
      name: "",
      key: {
        value: "",
        loading: true
      }
    },
    loadingNew: false,
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
  methods: {
    copyKey() {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.setup.key.value;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    },
    createServer() {
      this.e1 = 2;
      this.setup.created = false;
      var mainObj = this;
      mainObj.setup.key.loading = true;

      var coreInstance = new core(JSON.parse(localStorage.session));
      coreInstance
        .getInstance(localStorage.network)
        .asNetwork()
        .createServer(mainObj.setup.name)
        .then(function(instance) {
          mainObj.setup.created = true;
          mainObj.setup.error = null;
          instance.getKeys().then(function(keys) {
            mainObj.setup.key.value = keys[0].hash;
            mainObj.setup.key.loading = false;
          });
          mainObj.loadServers();
        })
        .catch(function(error) {
          mainObj.setup.created = false;
          mainObj.setup.error = error.message;
          mainObj.e1 = 1;
        });
    },
    createAnother() {
      this.e1 = 1;
      this.setup.created = false;
      if (
        this.setup.mode == "proxy" &&
        !this.setup.proxyAsked &&
        this.servers.length >= 2
      ) {
        this.setupProxy();
      }
    },
    setupProxy() {
      this.setup.proxyAsked = true;
      this.setup.proxyAsking = true;
    },
    loadServers() {
      this.loadingNew = true;
      this.servers = [];
      if (localStorage.session && localStorage.network) {
        network = localStorage.network;
        var coreInstance = new core(JSON.parse(localStorage.session));
        this.session = coreInstance.getCoreSession();
        var network = coreInstance
          .getInstance(localStorage.network)
          .asNetwork();
        var mainObj = this;
        this.network = network;
        network.getServers().then(function(servers) {
          mainObj.servers = servers;
          mainObj.loadingNew = false;
          if (mainObj.setup.mode != "view" && servers.length <= 0) {
            mainObj.setup.active = true;
          }
        });
      }
    }
  },
  mounted() {
    let vm = this;
    vm.loadServers();

    vm.$nextTick(function() {
      vm.setup.mode = vm.mode;
    });
  }
};
</script>
