<template>
  <v-app id="app">
    <!-- login form -->

    <v-app-bar app clipped-left v-if="$router.currentRoute.name != 'Login'">
      <v-app-bar-nav-icon
        @click="openDrawer()"
        v-if="$vuetify.breakpoint.smAndDown && drawer"
      />
      <v-toolbar-title>purecore</v-toolbar-title>
      <v-spacer />
      <v-btn to="/account/" icon>
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-dialog v-model="network.dialog" persistent max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>compare_arrows</v-icon>
          </v-btn>
        </template>
        <v-card max-width="500">
          <v-list v-if="availableNetworks.length > 0">
            <v-list-item-group v-model="network.switchId" color="primary">
              <v-list-item
                v-for="(network, i) in availableNetworks"
                :key="i"
                @click="selectNetwork(network)"
              >
                <v-list-item-icon>
                  <v-icon>arrow_forward</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="network.name"></v-list-item-title>
                </v-list-item-content>
                <!-- 
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon>delete_outline</v-icon>
                  </v-btn>
                </v-list-item-action>-->
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
                    :disabled="network.selectedId == null"
                    class="ma-2"
                    outlined
                    color="secondary"
                    >CLOSE</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-col>
            <v-col cols="6">
              <v-layout row wrap justify-end>
                <v-flex shrink>
                  <v-dialog v-model="setup.dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn class="ma-2" v-on="on" outlined color="primary"
                        >CREATE NETWORK</v-btn
                      >
                    </template>
                    <v-stepper v-model="setup.stepper">
                      <v-stepper-header>
                        <v-stepper-step :complete="setup.stepper > 1" step="1"
                          >Game</v-stepper-step
                        >

                        <v-divider></v-divider>

                        <v-stepper-step :complete="setup.stepper > 2" step="2"
                          >ID</v-stepper-step
                        >

                        <v-divider></v-divider>

                        <v-stepper-step :complete="setup.stepper > 3" step="3"
                          >Setup</v-stepper-step
                        >
                      </v-stepper-header>

                      <v-stepper-items>
                        <v-stepper-content step="1">
                          <v-row>
                            <v-col cols="12">
                              <p
                                class="heading"
                                style="font-size: 150%; margin: 0px;"
                              >
                                <strong>Game</strong>
                              </p>
                              <p class="heading" style="margin: 0px;">
                                Select the game your network is running
                              </p>
                              <v-divider class="mt-4" />
                              <v-btn
                                @click="
                                  (setup.game = 'minecraft'),
                                    (setup.stepper = 2)
                                "
                                depressed
                                block
                                color="secondary"
                                class="mt-4"
                                >Minecraft: Java Edition</v-btn
                              >
                              <v-btn
                                @click="
                                  (setup.game = 'minecraft_bedrock'),
                                    (setup.stepper = 2)
                                "
                                depressed
                                block
                                color="secondary"
                                class="mt-1"
                                >Minecraft: Bedrock Edition</v-btn
                              >
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
                                    @click="
                                      setup.dialog = false;
                                      setup.stepper = 1;
                                    "
                                    >CANCEL</v-btn
                                  >
                                </v-flex>
                              </v-layout>
                            </v-col>
                          </v-row>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                          <v-row class="mb-0 pb-0">
                            <v-col v-if="setup.error != null" cols="12" sm="12">
                              <v-expand-transition>
                                <v-alert
                                  class="mb-0"
                                  text
                                  color="primary"
                                  v-show="setup.error != null"
                                  >{{ setup.error }}</v-alert
                                >
                              </v-expand-transition>
                            </v-col>
                            <v-col cols="12" sm="12">
                              <v-text-field
                                hide-details
                                v-model="setup.name"
                                label="Network Name"
                                required
                                outlined
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6">
                              <v-text-field
                                hide-details
                                v-model="setup.cname"
                                label="Subdomain"
                                required
                                outlined
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6">
                              <v-text-field
                                hide-details
                                label="purecore.io"
                                outlined
                                disabled
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                              <v-checkbox
                                hide-details
                                v-model="setup.ipmode"
                                color="primary"
                                label="My network is already being hosted"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-expand-transition>
                            <v-row v-show="setup.ipmode">
                              <v-col cols="12" md="10" sm="8">
                                <v-text-field
                                  hide-details
                                  v-model="setup.ip"
                                  class="ma-0"
                                  label="IP"
                                  outlined
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="2" sm="4">
                                <v-text-field
                                  hide-details
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
                                    @click="
                                      setup.dialog = false;
                                      setup.stepper = 1;
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
                                    depressed
                                    color="primary"
                                    @click="
                                      setup.stepper = 3;
                                      createNetwork();
                                    "
                                    >NEXT</v-btn
                                  >
                                </v-flex>
                              </v-layout>
                            </v-col>
                          </v-row>
                        </v-stepper-content>

                        <v-stepper-content step="3">
                          <v-expand-transition>
                            <div v-show="!setup.created">
                              <center
                                style="padding-top: 50px; padding-bottom: 50px"
                              >
                                <v-progress-circular
                                  indeterminate
                                  color="primary"
                                ></v-progress-circular>
                              </center>
                            </div>
                          </v-expand-transition>
                          <v-expand-transition>
                            <div>
                              <v-row v-show="setup.created">
                                <v-col cols="12">
                                  <p
                                    class="heading"
                                    style="font-size: 150%; margin: 0px;"
                                  >
                                    <strong>Installation</strong>
                                  </p>
                                  <p class="heading" style="margin: 0px;">
                                    Install the plugins on your network
                                  </p>
                                  <v-divider class="mt-4" />

                                  <router-link
                                    :to="{
                                      name: 'ServerList',
                                      params: { mode: 'proxy' },
                                    }"
                                  >
                                    <v-btn
                                      @click="
                                        network.dialog = false;
                                        setup.stepper = 1;
                                        switchingNetworks = false;
                                      "
                                      depressed
                                      block
                                      color="secondary"
                                      class="mt-4"
                                      >Multiple Server Setup (Waterfall,
                                      Bungeecord, etc)</v-btn
                                    >
                                  </router-link>

                                  <router-link
                                    :to="{
                                      name: 'ServerList',
                                      params: { mode: 'single' },
                                    }"
                                  >
                                    <v-btn
                                      @click="
                                        network.dialog = false;
                                        setup.stepper = 1;
                                        switchingNetworks = false;
                                      "
                                      depressed
                                      block
                                      color="secondary"
                                      class="mt-1"
                                      >Single Server Setup (Spigot, Bukkit,
                                      etc)</v-btn
                                    >
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
                                        @click="
                                          network.dialog = false;
                                          setup.stepper = 1;
                                        "
                                        >SKIP</v-btn
                                      >
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
                </v-flex>
              </v-layout>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-btn
        @click="
          session = null;
          selectedNetwork = null;
        "
        v-if="session != null && session != undefined"
        icon
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>
      <!-- login form -->
    </v-app-bar>

    <v-content v-if="$router.currentRoute.name != 'Login'">
      <v-container fluid class="mb-5">
        <v-row align="center" justify="center">
          <v-col cols="12" xs="12" sm="12" md="10" lg="8" xl="6">
            <transition
              mode="out-in"
              @beforeLeave="beforeLeave"
              @enter="enter"
              @afterEnter="afterEnter"
              name="fade"
            >
              <router-view
                @setDrawer="setDrawer"
                :drawer="drawer"
                :key="session + network.selectedId"
                ref="childComponent"
                class="mb-5"
              />
            </transition>
          </v-col>
        </v-row>
      </v-container>
      <v-footer inset absolute>
        <center style="width: 100%">
          <v-btn style="text-transform: none" text :to="{ name: 'About' }">
            <span class="px-4"
              >&copy; 2019 / {{ new Date().getFullYear() }} quiquelhappy</span
            >
          </v-btn>
        </center>
      </v-footer>
    </v-content>
    <router-view
      @setDrawer="setDrawer"
      @initialCheck="initialCheck"
      v-if="$router.currentRoute.name == 'Login'"
      :drawer="drawer"
      :key="session + network.selectedId"
      ref="childComponent"
      class="mb-5"
    />
  </v-app>
</template>

<script>
import core from "purecore";

export default {
  name: "App",
  data: () => ({
    drawer: false,
    selectorModel: false,
    prevHeight: 0,
    network: {
      selectedId: null,
      dialog: false,
      switchId: null,
    },
    setup: {
      dialog: false,
      stepper: 1,
      ipmode: true,
      name: "",
      ip: "",
      port: "",
      game: "",
      cname: "",
      created: false,
      error: null,
      mandatory: false,
    },
    availableNetworks: [],
    session: null,
    loginLoading: false,
    selectedNetwork: null,
    selectedNetworkName: null,
    switchingNetworks: false,
  }),
  mounted() {
    this.initialCheck();
  },
  watch: {
    network: {
      handler: function(newData) {
        if (newData.selectedId != localStorage.getItem("network")) {
          localStorage.setItem("network", newData.selectedId);
        }
      },
      deep: true,
    },

    session(newSession) {
      if (
        newSession != null &&
        newSession != undefined &&
        newSession != "null" &&
        newSession != ""
      ) {
        localStorage.setItem("session", JSON.stringify(newSession));
      } else {
        localStorage.removeItem("session");
        this.checkSession();
      }
    },

    selectedNetwork(newNetwork) {
      var mainObj = this;
      var coreInstance = new core(JSON.parse(localStorage.session));

      coreInstance
        .getInstance(newNetwork, null, "NTW")
        .update()
        .then(function() {
          localStorage.network = newNetwork;
          mainObj.selectedNetwork = newNetwork;
          mainObj.selectorModel = newNetwork;
        })
        .catch(function() {
          localStorage.removeItem("network");
          mainObj.selectedNetwork = null;
          mainObj.getAvailableNetworks();
        });
    },

    switchingNetworks(newValue) {
      if (newValue) {
        this.getAvailableNetworks();
      }
    },
  },
  methods: {
    initialCheck() {
      if (localStorage.getItem("dark", null) != null) {
        var info = localStorage.getItem("dark") == "true";
        if (info) {
          this.dark = true;
        } else {
          this.dark = false;
        }
      }

      if (
        this.$router.currentRoute == "/" ||
        this.$router.currentRoute == "/login/" ||
        this.$router.currentRoute == null ||
        this.$router.currentRoute == undefined
      ) {
        this.$router.replace({ path: "/summary/general" });
      }

      this.checkSession();
    },
    setDrawer(e) {
      this.drawer = e;
    },
    openDrawer() {
      this.$refs.childComponent.openDrawer();
    },
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
    toLogin() {
      this.$router.push({ path: "/login/" });
    },
    checkSession() {
      if (localStorage.session) {
        try {
          var coreInstance = new core(JSON.parse(localStorage.session));
          this.session = coreInstance.getCoreSession();
          if (
            localStorage.network != null &&
            localStorage.network != undefined &&
            localStorage.network != "null"
          ) {
            this.network.selectedId = localStorage.network;
          } else {
            this.network.selectedId = null;
          }
          this.getAvailableNetworks();
        } catch (error) {
          localStorage.removeItem("session");
          this.toLogin();
        }
      } else {
        this.toLogin();
      }
    },
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
          mainObj.network.dialog = true;
        })
        .catch(function(error) {
          mainObj.setup.created = false;
          mainObj.setup.stepper = 2;
          mainObj.setup.error = error.message;
        });
    },
    disableNetworkSwitcher() {
      if (this.network.selectedId != null) {
        this.network.dialog = false;
      }
    },
    getAvailableNetworks() {
      if (this.session != undefined && this.session != null) {
        let main = this;
        this.session
          .getNetworks()
          .then(function(networks) {
            main.availableNetworks = networks;
            if (networks.length <= 0) {
              main.network.dialog = true;
              main.setup.mandatory = true;
            } else {
              if (main.network.selectedId == null) {
                main.network.dialog = true;
              } else {
                for (const key in networks) {
                  if (networks.hasOwnProperty(key)) {
                    const network = networks[key];
                    if (network.uuid == main.network.selectedId) {
                      main.network.switchId = parseInt(key);
                    }
                  }
                }
              }
              main.setup.mandatory = false;
            }
          })
          .catch(function() {
            localStorage.removeItem("session");
            main.checkSession();
          });
      }
    },
    selectNetwork(network) {
      this.network.selectedId = network.uuid;
      this.network.dialog = false;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Barlow&display=swap");
* {
  font-family: "Barlow", sans-serif;
}
</style>
