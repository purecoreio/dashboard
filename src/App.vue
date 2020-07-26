<template>
  <v-app id="app">
    <!-- login form -->

    <v-app-bar
      elevation="0"
      app
      clipped-left
      v-if="$router.currentRoute.name != 'Login'"
    >
      <v-app-bar-nav-icon
        @click="openDrawer()"
        v-if="$vuetify.breakpoint.smAndDown && drawer"
      />
      <v-row v-if="$vuetify.breakpoint.mdAndUp" no-gutters>
        <v-col>
          <div class="logo">
            <v-avatar size="20">
              <v-img src="./assets/c.png" />
            </v-avatar>
            <strong class="ml-2 primary--text" style="font-size:18px">
              purecore
            </strong>
          </div>
        </v-col>
        <v-col> </v-col>
      </v-row>
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
                  <v-btn
                    to="/setup/"
                    @click="network.dialog = false"
                    class="ma-2"
                    v-on="on"
                    outlined
                    color="primary"
                    >CREATE NETWORK</v-btn
                  >
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
                @selectNetwork="deselectAndShow"
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
    deselectAndShow() {
      this.network.selectedId = null;
      this.network.switchId = null;
      localStorage.removeItem("network");
      this.getAvailableNetworks();
    },
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
          console.log(error)
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
              main.$router.push({ path: "/setup/" });
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
          .catch(function(err) {
            console.log("network list err")
            console.log(err)
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
.logo {
  filter: grayscale(1);
  transition: 200ms;
}
.logo:hover {
  filter: grayscale(0);
}
</style>
