<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      permanent
      :temporary="primaryDrawer.type === 'temporary'"
      expand-on-hover
      app
      overflow
    >
      <v-list-item style="height: 120px">
        <v-list-item-content
          fill-height
          justify="center"
          align="center"
          v-if="selectedNetwork!=null&&selectedNetworkName!=null"
        >
          <center>
            <v-list-item-title class="title">
              {{ selectedNetworkName }}
              <v-btn @click="switchingNetworks=true" small color="primary" outlined text icon>
                <v-icon>compare_arrows</v-icon>
              </v-btn>
            </v-list-item-title>
            <v-list-item-subtitle>{{ selectedNetwork }}</v-list-item-subtitle>
          </center>
        </v-list-item-content>
        <v-list-item-content
          fill-height
          justify="center"
          align="center"
          v-if="selectedNetwork==null||selectedNetworkName==null"
        >
          <center>
            <v-list-item-title class="title">
              <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader>
            </v-list-item-subtitle>
          </center>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list shaped>
        <v-list-group
          v-for="item in items"
          :key="item.action"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link :to="subItem.path" v-for="subItem in item.items" :key="subItem.title">
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- login form -->

    <v-app-bar :clipped-left="primaryDrawer.clipped" app>
      <v-app-bar-nav-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      />
      <v-toolbar-title>purecore</v-toolbar-title>
      <v-spacer />

      <v-dialog
        :value="((selectedNetwork==undefined || selectedNetwork == null || switchingNetworks) && (session != null && session != undefined))&&!networkDialog"
        persistent
        max-width="500px"
      >
        <template v-slot:activator="{ on }">
          <v-btn rounded text @click="switchingNetworks=true">
            <v-icon>compare_arrows</v-icon>
          </v-btn>
        </template>
        <v-card max-width="500">
          <v-list v-if="availableNetworks.length > 0">
            <v-list-item-group v-model="model" color="primary">
              <v-list-item
                @click="selectedNetwork=i.uuid; switchingNetworks=false"
                v-for="i in availableNetworks"
                :key="i"
              >
                <v-list-item-icon>
                  <v-icon>arrow_forward</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="i.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-divider v-if="availableNetworks.length > 0"></v-divider>
          <v-row no-gutters class="px-3" max-width="500">
            <v-col cols="6">
              <v-layout row wrap justify-start>
                <v-flex shrink>
                  <v-btn
                    @click="disableNetworkSwitcher"
                    :disabled="selectedNetwork == null || selectedNetwork == undefined"
                    class="ma-2"
                    outlined
                    color="secondary"
                  >CLOSE</v-btn>
                </v-flex>
              </v-layout>
            </v-col>
            <v-col cols="6">
              <v-layout row wrap justify-end>
                <v-flex shrink>
                  <v-dialog v-model="networkDialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn class="ma-2" v-on="on" outlined color="primary">CREATE NETWORK</v-btn>
                    </template>
                    <v-stepper v-model="e1">
                      <v-stepper-header>
                        <v-stepper-step :complete="e1 > 1" step="1">Game</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 2" step="2">ID</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 3" step="3">Setup</v-stepper-step>
                      </v-stepper-header>

                      <v-stepper-items>
                        <v-stepper-content step="1">
                          <v-row>
                            <v-col cols="12">
                              <p class="heading" style="font-size: 150%; margin: 0px;">
                                <strong>Game</strong>
                              </p>
                              <p
                                class="heading"
                                style="margin: 0px;"
                              >Select the game your network is running</p>
                              <v-divider class="mt-4" />
                              <v-btn
                                @click="setup.game='minecraft', e1=2"
                                depressed
                                block
                                color="secondary"
                                class="mt-4"
                              >Minecraft: Java Edition</v-btn>
                              <v-btn
                                @click="setup.game='minecraft_bedrock', e1=2"
                                depressed
                                block
                                color="secondary"
                                class="mt-1"
                              >Minecraft: Bedrock Edition</v-btn>
                            </v-col>
                          </v-row>
                          <v-row no-gutters class="px-3">
                            <v-col cols="6">
                              <v-layout row wrap justify-start>
                                <v-flex shrink>
                                  <v-btn
                                    outlined
                                    v-if="!setup.mandatory"
                                    color="secondary"
                                    @click="networkDialog=false;e1=1"
                                  >CANCEL</v-btn>
                                </v-flex>
                              </v-layout>
                            </v-col>
                          </v-row>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                          <v-row class="mb-0 pb-0">
                            <v-col cols="12" sm="12">
                              <v-expand-transition>
                                <v-alert
                                  text
                                  color="primary"
                                  v-show="setup.error!=null"
                                >{{setup.error}}</v-alert>
                              </v-expand-transition>
                            </v-col>
                            <v-col cols="12" sm="12">
                              <v-text-field
                                v-model="setup.name"
                                label="Network Name"
                                required
                                outlined
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6">
                              <v-text-field
                                v-model="setup.cname"
                                label="Subdomain"
                                required
                                outlined
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6">
                              <v-text-field label="purecore.io" outlined disabled></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                              <v-checkbox
                                v-model="setup.ipmode"
                                color="primary"
                                label="My network is already being hosted"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-expand-transition>
                            <v-row v-show="setup.ipmode">
                              <v-col cols="12" md="10" sm="8">
                                <v-text-field v-model="setup.ip" class="ma-0" label="IP" outlined></v-text-field>
                              </v-col>
                              <v-col cols="12" md="2" sm="4">
                                <v-text-field
                                  v-model="setup.port"
                                  class="ma-0"
                                  label="Port"
                                  outlined
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-expand-transition>
                          <v-row no-gutters class="px-3">
                            <v-col cols="6">
                              <v-layout row wrap justify-start>
                                <v-flex shrink>
                                  <v-btn
                                    outlined
                                    v-if="!setup.mandatory"
                                    color="secondary"
                                    @click="networkDialog=false;e1=1"
                                  >CANCEL</v-btn>
                                </v-flex>
                              </v-layout>
                            </v-col>
                            <v-col cols="6">
                              <v-layout row wrap justify-end>
                                <v-flex shrink>
                                  <v-btn
                                    depressed
                                    color="primary"
                                    @click="e1=3; createNetwork()"
                                  >NEXT</v-btn>
                                </v-flex>
                              </v-layout>
                            </v-col>
                          </v-row>
                        </v-stepper-content>

                        <v-stepper-content step="3">
                          <v-expand-transition>
                            <div v-show="!setup.created">
                              <center style="padding-top: 50px; padding-bottom: 50px">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                              </center>
                            </div>
                          </v-expand-transition>
                          <v-expand-transition>
                            <v-row v-show="setup.created">
                              <v-col cols="12">
                                <p class="heading" style="font-size: 150%; margin: 0px;">
                                  <strong>Installation</strong>
                                </p>
                                <p
                                  class="heading"
                                  style="margin: 0px;"
                                >Install the plugins on your network</p>
                                <v-divider class="mt-4" />

                                <router-link
                                  :to="{ name: 'ServerList' , params: { mode: 'proxy' } }"
                                >
                                  <v-btn
                                    @click="networkDialog=false;e1=1;switchingNetworks=false"
                                    depressed
                                    block
                                    color="secondary"
                                    class="mt-4"
                                  >Multiple Server Setup (Waterfall, Bungeecord, etc)</v-btn>
                                </router-link>

                                <router-link
                                  :to="{ name: 'ServerList' , params: { mode: 'single' } }"
                                >
                                  <v-btn
                                    @click="networkDialog=false;e1=1;switchingNetworks=false"
                                    depressed
                                    block
                                    color="secondary"
                                    class="mt-1"
                                  >Single Server Setup (Spigot, Bukkit, etc)</v-btn>
                                </router-link>
                              </v-col>
                            </v-row>
                            <v-row no-gutters class="px-3">
                              <v-col cols="6">
                                <v-layout row wrap justify-start>
                                  <v-flex shrink>
                                    <v-btn
                                      outlined
                                      color="secondary"
                                      @click="networkDialog=false;e1=1"
                                    >SKIP</v-btn>
                                  </v-flex>
                                </v-layout>
                              </v-col>
                            </v-row>
                          </v-expand-transition>
                        </v-stepper-content>
                      </v-stepper-items>
                    </v-stepper>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-btn
        @click="session=null; selectedNetwork=null"
        v-if="(session != null && session != undefined)"
        icon
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>

      <v-dialog :value="!(session != null && session != undefined)" persistent max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-if="!(session != null && session != undefined)" rounded text v-on="on">
            LOGIN WITH GOOGLE
            <v-avatar right size="25px" style="margin-left: 10px">
              <v-img src="./assets/glogo.svg" alt="Login" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="mx-auto" max-width="500">
          <v-img src="./assets/piston.png" height="300px"></v-img>
          <center>
            <v-btn
              @click="GoogleLoginHandle"
              v-if="!(session != null && session != undefined)"
              rounded
              outlined
              v-on="on"
              :loading="loginLoading"
              style="margin-bottom: 30px"
            >
              {{loginString}}
              <v-avatar right size="25px" style="margin-left: 10px">
                <v-img src="./assets/glogo.svg" alt="Login" />
              </v-avatar>
            </v-btn>
          </center>
        </v-card>
      </v-dialog>

      <!-- login form -->
    </v-app-bar>

    <v-content>
      <v-container fluid class="mb-5">
        <v-row align="center" justify="center">
          <v-col cols="12" xs="12" sm="12" md="10" lg="8" xl="6">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
      <v-footer absolute>
        <center style="width: 100%">
          <router-link :to="{ name: 'About' }">
            <span class="px-4">&copy; 2019-{{ new Date().getFullYear() }} quiquelhappy</span>
          </router-link>
        </center>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
import core from "purecore";

export default {
  name: "App",
  data: () => ({
    networkDialog: false,
    setup: {
      ipmode: true,
      name: "",
      ip: "",
      port: "",
      game: "",
      cname: "",
      created: false,
      error: null,
      mandatory: false
    },
    e1: 1,
    availableNetworks: [],
    session: null,
    loginString: "LOGIN WITH GOOGLE",
    loginLoading: false,
    selectedNetwork: null,
    selectedNetworkName: null,
    switchingNetworks: false,
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "default (no property)",
      clipped: true,
      floating: true,
      mini: false
    },
    footer: {
      inset: false
    },
    items: [
      {
        action: "summary",
        title: "Summary",
        icon: "dashboard",
        active: true,
        items: [
          {
            title: "General View",
            path: "/summary/general"
          },
          { title: "Instance View", path: "/summary/instance" }
        ]
      },
      {
        action: "players",
        title: "Players",
        icon: "supervisor_account",
        items: [{ title: "Lookup", path: "/players/lookup" }]
      },
      {
        action: "analytics",
        title: "Analytics",
        icon: "bar_chart",
        items: [
          { title: "General Stats", path: "/analytics/general" },
          { title: "Instance Growth", path: "/analytics/growth" },
          { title: "Game Stats", path: "/analytics/game" },
          { title: "Feedback", path: "/analytics/feedback" }
        ]
      },
      {
        action: "servers",
        title: "Servers",
        icon: "view_list",
        items: [
          { title: "List", path: "/servers/list" },
          { title: "Machines", path: "/servers/machines" }
        ]
      },
      {
        action: "donations",
        title: "Donations",
        icon: "store",
        items: [
          { title: "Transactions", path: "/donations/transactions" },
          { title: "Packages", path: "/donations/packages" }
        ]
      },
      {
        action: "forum",
        title: "Forum",
        icon: "chat_bubble",
        items: [
          { title: "News", path: "/forum/news" },
          { title: "Sections", path: "/forum/sections" },
          { title: "Threads", path: "/forum/threads" },
          { title: "Actions", path: "/forum/actions" },
          { title: "Badges", path: "/forum/badges" }
        ]
      },
      {
        action: "punishments",
        title: "Punishments",
        icon: "gavel",
        items: [
          { title: "Offences", path: "/punishments/offences" },
          { title: "Actions", path: "/punishments/actions" },
          { title: "History", path: "/punishments/history" },
          { title: "Appeals", path: "/punishments/appeals" },
          { title: "Reports", path: "/punishments/reports" }
        ]
      },
      {
        action: "billing",
        title: "Billing",
        icon: "attach_money",
        items: [{ title: "Invoices", path: "/billing/invoices" }]
      },
      {
        action: "website",
        title: "Website",
        icon: "dvr",
        items: [
          { title: "Domain", path: "/website/domain" },
          { title: "Themes", path: "/website/themes" },
          { title: "Pages", path: "/website/pages" }
        ]
      }
    ]
  }),
  mounted() {
    if (localStorage.session) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.session = coreInstance.getCoreSession();
      if (localStorage.network != null && localStorage.network != undefined) {
        this.selectedNetwork = localStorage.network;
      } else {
        this.getAvailableNetworks();
      }
    }

    if (
      this.$router.currentRoute == "/" ||
      this.$router.currentRoute == null ||
      this.$router.currentRoute == undefined
    ) {
      this.$router.replace({ path: "/summary/general" });
    }
  },
  watch: {
    session(newSession) {
      localStorage.session = JSON.stringify(newSession);
    },
    selectedNetwork(newNetwork) {
      localStorage.network = newNetwork;

      var mainObj = this;

      var coreInstance = new core(JSON.parse(localStorage.session));
      mainObj.selectedNetworkName = null;

      coreInstance
        .getInstance(newNetwork, null, "NTW")
        .update()
        .then(function(instance) {
          mainObj.selectedNetworkName = instance.getName();
        });
    },
    switchingNetworks(newValue) {
      if (newValue) {
        this.getAvailableNetworks();
      }
    }
  },
  methods: {
    createNetwork() {
      var mainObj = this;
      var coreInstance = new core(JSON.parse(localStorage.session));
      var promise = null;
      if (this.setup.ipmode) {
        if (this.setup.port == null || this.setup.port == "") {
          promise = coreInstance
            .getCoreSession()
            .getUser()
            .createNetwork(
              mainObj.setup.name,
              mainObj.setup.game,
              mainObj.setup.cname,
              mainObj.setup.ip
            );
        } else {
          promise = coreInstance
            .getCoreSession()
            .getUser()
            .createNetwork(
              mainObj.setup.name,
              mainObj.setup.game,
              mainObj.setup.cname,
              mainObj.setup.ip,
              parseInt(mainObj.setup.port)
            );
        }
      } else {
        promise = coreInstance
          .getCoreSession()
          .getUser()
          .createNetwork(
            mainObj.setup.name,
            mainObj.setup.game,
            mainObj.setup.cname
          );
      }

      promise
        .then(function(network) {
          mainObj.setup.created = true;
          mainObj.getAvailableNetworks();
          mainObj.selectedNetwork = network.getId();
          mainObj.networkDialog = true;
        })
        .catch(function(error) {
          mainObj.setup.created = false;
          mainObj.e1 = 2;
          mainObj.setup.error = error.message;
        });
    },
    disableNetworkSwitcher() {
      if (this.selectedNetwork != null && this.selectedNetwork != undefined) {
        this.switchingNetworks = false;
      }
    },
    getAvailableNetworks() {
      if (this.session != undefined && this.session != null) {
        var mainObj = this;

        this.session.getNetworks().then(function(networks) {
          mainObj.availableNetworks = networks;
          if (networks.length <= 0) {
            mainObj.networkDialog = true;
            mainObj.setup.mandatory = true;
          } else {
            if (mainObj.networkDialog) {
              setTimeout(() => {
                mainObj.networkDialog = true;
              }, 1);
            }
            mainObj.setup.mandatory = false;
          }
        });
      }
    },
    GoogleLoginHandle() {
      this.loginLoading = true;
      var mainObj = this;

      this.$gAuth.signIn().then(GoogleUser => {
        new core()
          .fromToken(GoogleUser.getAuthResponse().id_token)
          .then(function(core) {
            // to-do save core session

            mainObj.loginLoading = false;
            mainObj.session = core.getCoreSession();

            mainObj.getAvailableNetworks();
          });
      });
    }
  }
};
</script>
