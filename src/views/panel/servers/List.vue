<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <div v-if="servers.length > 1 && network != null">
      <ServerRow
        v-show="true"
        name="Proxy Instance"
        :uuid="network.uuid"
      ></ServerRow>
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

    <div v-if="servers != null && servers.length <= 0">
      <v-alert class="mt-10 mb-10" text color="primary">
        please, setup your first server to start using purecore
      </v-alert>
      <v-row align="center">
        <v-col class="text-center pt-10 pb-10">
          <div>
            <v-icon large class="mb-6">
              storage
            </v-icon>
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                to="/servers/list/proxy"
                color="primary"
                depressed
                rounded
                v-bind="attrs"
                @click="
                  setup.active = true;
                  setup.mode = 'proxy';
                "
                v-on="on"
              >
                multi-server setup
              </v-btn>
            </template>
            <span
              >perfect for proxied servers with bungeecord, waterfall or
              others</span
            >
          </v-tooltip>
        </v-col>
        <v-col class="text-center pt-10 pb-10">
          <div>
            <v-icon large class="mb-6">
              dns
            </v-icon>
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                to="/servers/list/single"
                color="primary"
                depressed
                rounded
                v-bind="attrs"
                @click="
                  setup.active = true;
                  setup.mode = 'single';
                "
                v-on="on"
              >
                single-server setup
              </v-btn>
            </template>
            <span>perfect for single-instance servers</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>

    <v-btn
      v-if="servers != null && servers.length > 0"
      style="float: right"
      color="primary"
      @click="setup.active = true"
      dark
      >Add Server
    </v-btn>

    <v-dialog v-model="setup.active" persistent max-width="600px">
      <v-stepper v-model="e1">
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="mt-0 pt-0">
              <v-col class="pt-0" cols="12">
                <v-text-field
                  v-model="setup.name"
                  outlined
                  label="Instance Name"
                  autocomplete="off"
                  required
                  hide-details
                ></v-text-field>
                <v-alert class="mt-4" color="primary" text>
                  Spaces will be converted to underscores
                </v-alert>
                <v-alert
                  transition="scale-transition"
                  :value="setup.error != null"
                  text
                  color="primary"
                >
                  {{ setup.error }}</v-alert
                >
              </v-col>
            </v-row>
            <v-row no-gutters class="px-3">
              <v-col cols="6">
                <v-layout row wrap justify-start>
                  <v-flex shrink>
                    <v-btn
                      outlined
                      color="secondary"
                      v-if="
                        setup.mode == 'view' ||
                          setup.mode == 'single' ||
                          (setup.mode == 'proxy' && servers.length > 1)
                      "
                      @click="
                        setup.active = false;
                        e1 = 1;
                      "
                      >CANCEL</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-col>
              <v-col cols="6">
                <v-layout row wrap justify-end>
                  <v-flex shrink>
                    <v-btn
                      :loading="setup.loading"
                      depressed
                      color="primary"
                      @click="createServer()"
                      >Create</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-expand-transition>
              <div v-show="!setup.created">
                <center style="padding-top: 50px; padding-bottom: 50px">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </center>
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <div v-show="setup.created">
                <v-alert text color="primary">
                  Your instance has been created. Install the plugin and copy
                  they key in your config
                </v-alert>
                <v-alert
                  v-if="
                    mode == 'proxy' &&
                      instances != null &&
                      instances.length <= 1
                  "
                  text
                  color="primary"
                  >You should add at least two instances before setting up your
                  proxy instance</v-alert
                >
                <v-row no-gutters>
                  <v-col cols="12" sm="6">
                    <v-btn
                      outlined
                      color="primary"
                      :block="!$vuetify.breakpoint.smAndUp"
                      :class="!$vuetify.breakpoint.smAndUp ? 'mb-2' : ''"
                      v-if="
                        setup.mode == 'view' ||
                          setup.mode == 'single' ||
                          (setup.mode == 'proxy' && servers.length > 1)
                      "
                      @click="
                        setup.active = false;
                        e1 = 1;
                      "
                      >CLOSE</v-btn
                    >
                  </v-col>
                  <v-col class="text-right" cols="12" sm="6">
                    <v-btn
                      @click="copyKey()"
                      v-if="!(setup.mode == 'proxy' && servers.length > 1)"
                      :disabled="setup.key.loading"
                      :loading="setup.key.loading"
                      :block="!$vuetify.breakpoint.smAndUp"
                      :class="!$vuetify.breakpoint.smAndUp ? 'mb-2' : ' mr-2'"
                      outlined
                      color="primary"
                      >Copy Key</v-btn
                    >
                    <v-btn
                      depressed
                      color="primary"
                      :block="!$vuetify.breakpoint.smAndUp"
                      :class="!$vuetify.breakpoint.smAndUp ? 'mb-2' : ''"
                      v-if="setup.mode == 'proxy'"
                      @click="createAnother()"
                      >Add Another</v-btn
                    >
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
        <p>
          Do you want to setup your proxy instance already? Or do you prefer
          keep adding servers?
        </p>
        <v-divider class="mt-4 mb-4" />
        <v-row no-gutters class="px-3">
          <v-col cols="6">
            <v-layout row wrap justify-start>
              <v-flex shrink>
                <v-btn
                  outlined
                  color="secondary"
                  @click="setup.proxyAsking = false"
                  >KEEP ADDING</v-btn
                >
              </v-flex>
            </v-layout>
          </v-col>
          <v-col cols="6">
            <v-layout row wrap justify-end>
              <v-flex shrink>
                <v-btn
                  depressed
                  color="primary"
                  @click="
                    setup.active = false;
                    setup.proxyAsking = false;
                  "
                  >SETUP</v-btn
                >
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
    ServerRow: ServerRow,
  },
  props: ["mode"],
  watch: {
    e1(value) {
      if (value == 1) {
        this.setup.name = "";
      }
    },
  },
  data: () => ({
    setup: {
      loading: false,
      mode: null,
      created: false,
      proxyAsked: false,
      active: false,
      proxyAsking: false,
      error: null,
      name: "",
      key: {
        value: "",
        loading: true,
      },
    },
    loadingNew: false,
    session: null,
    servers: [],
    location: [
      {
        text: "Servers",
        disabled: true,
        href: "",
      },
      {
        text: "List",
        disabled: false,
        href: "#",
      },
    ],
    dialog: false,
    e1: 1,
    network: null,
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
      this.setup.created = false;
      var mainObj = this;
      mainObj.setup.loading = true;
      mainObj.setup.key.loading = true;
      mainObj.setup.error = null;
      mainObj.network
        .createServer(mainObj.setup.name)
        .then(function(instance) {
          mainObj.setup.loading = false;
          mainObj.e1 = 2;
          mainObj.setup.created = true;
          mainObj.setup.error = null;
          instance.getKeys().then(function(keys) {
            mainObj.setup.key.value = keys[0].hash;
            mainObj.setup.key.loading = false;
          });
          mainObj.loadServers();
        })
        .catch(function(error) {
          mainObj.setup.loading = false;
          mainObj.setup.created = false;
          mainObj.setup.error = error;
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
    },
  },
  mounted() {
    let vm = this;
    vm.loadServers();

    vm.$nextTick(function() {
      vm.setup.mode = vm.mode;
    });
  },
};
</script>
